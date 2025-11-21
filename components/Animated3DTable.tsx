
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { USERS, ORDERS } from '../constants';
import { Step, GridCell, UnifiedRow } from '../types';

interface Animated3DTableProps {
  step: Step;
}

// Helper to create a unified row object that tracks logic across all steps
const generateUnifiedData = (): UnifiedRow[] => {
  const rows: UnifiedRow[] = [];

  // 1. Map Users to their Orders (Left Match)
  USERS.forEach((user, uIdx) => {
    const userOrders = ORDERS.filter(o => o.fkUid === user.id);
    
    if (userOrders.length > 0) {
      // Create a row for EACH order matched to this user
      userOrders.forEach((order, idx) => {
        // Find original index of order for Step 0 positioning
        const originalOrderIndex = ORDERS.findIndex(o => o.id === order.id);
        
        rows.push({
          rowId: `u-${user.id}-o-${order.id}`,
          user,
          order,
          isMatched: true,
          isSecondaryUser: idx > 0, // Mark duplicates for Step 0 hiding
          isFilteredByWhere: !['USA', 'Korea', 'UK'].includes(user.country),
          isFilteredByLimit: false, // Calc later
          originalUserIndex: uIdx,
          originalOrderIndex: originalOrderIndex
        });
      });
    } else {
      // User with NO orders (Chen, Eiko)
      rows.push({
        rowId: `u-${user.id}-null`,
        user,
        order: null,
        isMatched: false,
        isSecondaryUser: false,
        isFilteredByWhere: true, // Logic doesn't matter as they drop in Step 1
        isFilteredByLimit: true,
        originalUserIndex: uIdx,
        originalOrderIndex: -1
      });
    }
  });

  // 2. Map Orphan Orders (Orders with no matching User)
  ORDERS.forEach((order, oIdx) => {
    if (!USERS.find(u => u.id === order.fkUid)) {
      rows.push({
        rowId: `null-o-${order.id}`,
        user: null,
        order,
        isMatched: false,
        isSecondaryUser: false,
        isFilteredByWhere: true,
        isFilteredByLimit: true,
        originalUserIndex: -1,
        originalOrderIndex: oIdx
      });
    }
  });

  return rows;
};

const INITIAL_DATA = generateUnifiedData();

export const Animated3DTable: React.FC<Animated3DTableProps> = ({ step }) => {

  // This function computes the EXACT position and visibility of every single cell
  const cells = useMemo(() => {
    const allCells: GridCell[] = [];
    
    let processedRows = [...INITIAL_DATA];

    // Step 1: ON (Filter Unmatched)
    if (step >= Step.ON) {
      processedRows = processedRows.filter(r => r.isMatched);
    }

    // Step 2: WHERE
    if (step >= Step.WHERE) {
      processedRows = processedRows.filter(r => !r.isFilteredByWhere);
    }

    // SPECIAL HANDLING FOR STEP 3+ (GROUP BY -> LIMIT)
    if (step >= Step.GROUP_BY) {
      // 1. Aggregate Data
      const groups: Record<string, { country: string; count: number; total: number; avg: number }> = {};

      processedRows.forEach(r => {
        if (r.user && r.order) {
          const c = r.user.country;
          if (!groups[c]) groups[c] = { country: c, count: 0, total: 0, avg: 0 };
          groups[c].count += 1;
          groups[c].total += r.order.amount;
        }
      });

      let sortedGroups = Object.values(groups).map(g => ({
        ...g,
        avg: g.count > 0 ? g.total / g.count : 0,
      }));

      // 1b. HAVING Clause Filter
      if (step >= Step.HAVING) {
        sortedGroups = sortedGroups.filter(g => g.total > 200);
      }

      // Sort Logic
      if (step >= Step.ORDER_BY) {
        // Sort by Amount ASC (Cheapest first, as per logic)
        sortedGroups.sort((a, b) => a.total - b.total);
      } else {
        // Default Group By Sort (Alphabetical)
        sortedGroups.sort((a, b) => a.country.localeCompare(b.country));
      }

      // 2. Define Columns based on Step
      // WHERE -> GROUP BY transition:
      // Country stays at 3. New columns at 4, 5, 7.
      // SELECT: Center Country and Total (e.g., 4 and 6).
      const isSelectOrLater = step >= Step.SELECT;
      
      const colMapping = isSelectOrLater 
        ? { country: 4, placeholder: -1, count: -1, average: -1, total: 5 } // Centered projection (Country + Total)
        : { country: 3, placeholder: 4, count: 5, average: 6, total: 7 };  // Standard table view with extra AVG column

      // Headers
      // Country (Reuse key 'h_u_ctry' for smooth transition from Step 2)
      allCells.push({
          key: 'h_u_ctry', 
          content: 'COUNTRY',
          type: 'header',
          source: 'group',
          colName: 'country',
          gridRow: 1,
          gridCol: colMapping.country,
          isVisible: true,
          colorTheme: 'emerald',
          customOpacity: 1
      });

      if (!isSelectOrLater) {
          // Placeholder Column
           allCells.push({
              key: 'h_grp_ph',
              content: '...',
              type: 'header',
              source: 'group',
              colName: 'placeholder',
              gridRow: 1,
              gridCol: colMapping.placeholder,
              isVisible: true,
              colorTheme: 'emeraldSoft',
              customOpacity: 0.8
          });
          // Count Column
           allCells.push({
              key: 'h_grp_cnt',
              content: 'ORDER COUNT',
              subtitle: 'COUNT(*)',
              type: 'header',
              source: 'group',
              colName: 'count',
              gridRow: 1,
              gridCol: colMapping.count,
              isVisible: true,
              colorTheme: 'emeraldSoft',
              customOpacity: 0.8
          });
          // Average Amount Column
           allCells.push({
              key: 'h_grp_avg',
              content: 'AVG AMOUNT',
              subtitle: 'AVG(AMOUNT)',
              type: 'header',
              source: 'group',
              colName: 'average',
              gridRow: 1,
              gridCol: colMapping.average,
              isVisible: true,
              colorTheme: 'emeraldSoft',
              customOpacity: 0.8
          });
      }

      // Total Amount (Reuse key 'h_o_amt' for smooth transition from individual amounts)
      allCells.push({
          key: 'h_o_amt', 
          content: 'TOTAL AMOUNT',
          subtitle: 'SUM(AMOUNT)',
          type: 'header',
          source: 'group',
          colName: 'total',
          gridRow: 1,
          gridCol: colMapping.total,
          isVisible: true,
          colorTheme: 'emerald',
          customOpacity: 1
      });

      // Data Rows
      sortedGroups.forEach((g, idx) => {
        const rowNum = 2 + idx;
        const isDimmed = step === Step.LIMIT && idx >= 1; // LIMIT 1
        
        // Country Cell
        allCells.push({
          key: `grp-${g.country}-c`,
          content: g.country,
          type: 'data',
          source: 'group',
          colName: 'country',
          gridRow: rowNum,
          gridCol: colMapping.country,
          isVisible: true,
          colorTheme: 'emerald',
          isDimmed,
          customOpacity: 1
        });

        if (!isSelectOrLater) {
          // Placeholder Cell
          allCells.push({
            key: `grp-${g.country}-ph`,
            content: '...',
            type: 'data',
            source: 'group',
            colName: 'placeholder',
            gridRow: rowNum,
            gridCol: colMapping.placeholder,
            isVisible: true,
            colorTheme: 'emeraldSoft',
            isDimmed,
            customOpacity: 0.8
          });

          // Count Cell
          allCells.push({
            key: `grp-${g.country}-n`,
            content: g.count,
            type: 'data',
            source: 'group',
            colName: 'count',
            gridRow: rowNum,
            gridCol: colMapping.count,
            isVisible: true,
            colorTheme: 'emeraldSoft',
            isDimmed,
            customOpacity: 0.8
          });

          // Average Amount Cell
          allCells.push({
            key: `grp-${g.country}-avg`,
            content: g.avg.toFixed(0),
            type: 'data',
            source: 'group',
            colName: 'average',
            gridRow: rowNum,
            gridCol: colMapping.average,
            isVisible: true,
            colorTheme: 'emeraldSoft',
            isDimmed,
            customOpacity: 0.8
          });
        }

        // Total Cell
        allCells.push({
          key: `grp-${g.country}-t`,
          content: g.total,
          type: 'data',
          source: 'group',
          colName: 'total',
          gridRow: rowNum,
          gridCol: colMapping.total,
          isVisible: true,
          colorTheme: 'emerald',
          isDimmed,
          customOpacity: 1
        });
      });

      return allCells;
    }

    // --- STANDARD LOGIC FOR STEPS 0, 1, 2 ---

    // --- LAYOUT GENERATION ---
    const HEADER_ROW = 1;
    const START_ROW = 2;
    
    const getCol = (colName: string): number => {
      // Note: SELECT step handled in Group Block above for aggregation flow.
      // This block handles standard row projection.
      if (step >= Step.ON) {
        switch (colName) {
          case 'user_id': return 1;
          case 'user_name': return 2;
          case 'user_country': return 3;
          case 'order_uid': return 4; // Visually "Snaps" to User Table
          case 'order_id': return 5;
          case 'order_product': return 6;
          case 'order_amount': return 7;
          default: return -1;
        }
      } else {
        // FROM & JOIN: Split View
        switch (colName) {
          case 'user_id': return 1;
          case 'user_name': return 2;
          case 'user_country': return 3;
          // Gap at 4, 5
          case 'order_id': return 6;
          case 'order_uid': return 7;
          case 'order_product': return 8;
          case 'order_amount': return 9;
          default: return -1;
        }
      }
    };

    // Headers
    const headers = [
      { key: 'h_u_id', label: 'USER ID', src: 'user', col: 'user_id' },
      { key: 'h_u_name', label: 'NAME', src: 'user', col: 'user_name' },
      { key: 'h_u_ctry', label: 'COUNTRY', src: 'user', col: 'user_country' },
      { key: 'h_o_id', label: 'ORDER ID', src: 'order', col: 'order_id' },
      { key: 'h_o_uid', label: 'UID', src: 'order', col: 'order_uid' },
      { key: 'h_o_prod', label: 'PRODUCT', src: 'order', col: 'order_product' },
      { key: 'h_o_amt', label: 'AMOUNT', src: 'order', col: 'order_amount' },
    ];

    headers.forEach(h => {
      const gridCol = getCol(h.col);
      if (gridCol !== -1) {
        allCells.push({
          key: h.key,
          content: h.label,
          type: 'header',
          source: h.src as 'user' | 'order',
          colName: h.col,
          gridRow: HEADER_ROW,
          gridCol,
          isVisible: true,
          colorTheme: h.src === 'user' ? 'cyan' : 'fuchsia'
        });
      }
    });

    // Data Rows
    const rowsToRender = step === Step.FROM_JOIN ? INITIAL_DATA : processedRows;

    rowsToRender.forEach((row) => {
      // Determine Grid Row Index
      let gridRow = -1;
      let isDimmed = false;

      if (step === Step.FROM_JOIN) {
        // In Step 0, layout is static based on original tables
        if (row.user && !row.isSecondaryUser) {
          gridRow = START_ROW + row.originalUserIndex;
        } 
      } else {
        // In Step >= 1, layout is based on current sort order
        const idx = processedRows.findIndex(r => r.rowId === row.rowId);
        if (idx !== -1) {
           gridRow = START_ROW + idx;
        }
      }

      // Render User Cells
      if (row.user) {
        const showUser = step === Step.FROM_JOIN ? !row.isSecondaryUser : true;
        
        if (showUser) {
            const uCols = [
                { val: row.user.id, col: 'user_id', k: 'id' },
                { val: row.user.name, col: 'user_name', k: 'name' },
                { val: row.user.country, col: 'user_country', k: 'ctry' }
            ];

            uCols.forEach(c => {
                const gc = getCol(c.col);
                if (gc !== -1) {
                     allCells.push({
                        key: `u-${row.user!.id}-${c.k}${row.isSecondaryUser ? '-dup' : ''}`,
                        content: c.val,
                        type: 'data',
                        source: 'user',
                        colName: c.col,
                        gridRow: gridRow,
                        gridCol: gc,
                        isVisible: true,
                        isDimmed: isDimmed, 
                        colorTheme: 'cyan'
                     });
                }
            });
        }
      }

      // Render Order Cells
      if (row.order) {
          let orderGridRow = gridRow;
          
          if (step === Step.FROM_JOIN) {
             orderGridRow = START_ROW + row.originalOrderIndex;
          }
          
          const oCols = [
              { val: row.order.id, col: 'order_id', k: 'oid' },
              { val: row.order.fkUid, col: 'order_uid', k: 'uid' },
              { val: row.order.product, col: 'order_product', k: 'prod' },
              { val: row.order.amount, col: 'order_amount', k: 'amt' }
          ];

          oCols.forEach(c => {
              const gc = getCol(c.col);
              if (gc !== -1) {
                  allCells.push({
                      key: `o-${row.order!.id}-${c.k}`,
                      content: c.val,
                      type: 'data',
                      source: 'order',
                      colName: c.col,
                      gridRow: orderGridRow,
                      gridCol: gc,
                      isVisible: true,
                      isDimmed: isDimmed,
                      colorTheme: 'fuchsia'
                  });
              }
          });
      }
    });

    return allCells;

  }, [step]);

  // Helper for color resolution
  const getColors = (theme: 'cyan' | 'fuchsia' | 'neutral' | 'emerald' | 'emeraldSoft', type: 'header' | 'data') => {
  if (type === 'header') {
    switch (theme) {
        case 'cyan': return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-300' };
        case 'fuchsia': return { bg: 'rgba(217, 70, 239, 0.15)', border: 'rgba(217, 70, 239, 0.4)', text: 'text-fuchsia-300' };
        case 'emerald': return { bg: 'rgba(16, 185, 129, 0.20)', border: 'rgba(16, 185, 129, 0.5)', text: 'text-emerald-300' }; // More opacity for emphasis
        case 'emeraldSoft': return { bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.18)', text: 'text-emerald-200' };
        default: return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.2)', text: 'text-slate-300' };
      }
    } else {
      // Data
      switch (theme) {
        case 'cyan': return { bg: 'rgba(255, 255, 255, 0.02)', border: 'rgba(255, 255, 255, 0.08)', text: 'text-cyan-300' };
        case 'fuchsia': return { bg: 'rgba(255, 255, 255, 0.02)', border: 'rgba(255, 255, 255, 0.08)', text: 'text-fuchsia-300' };
        case 'emerald': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: 'text-emerald-400' };
        case 'emeraldSoft': return { bg: 'rgba(16, 185, 129, 0.02)', border: 'rgba(16, 185, 129, 0.10)', text: 'text-emerald-200' };
        default: return { bg: 'rgba(255,255,255,0.01)', border: 'rgba(255,255,255,0.05)', text: 'text-slate-500' };
      }
    }
  };

  return (
    <div className="relative w-full h-[600px] flex justify-center items-center perspective-1000 overflow-hidden">
        {/* Background grid hints */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
             style={{
                 backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
             }}
        />

        <motion.div 
            className="w-full max-w-6xl preserve-3d"
            animate={{ 
                rotateX: 15,
                y: [0, -15, 0], 
            }}
            transition={{ 
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                rotateX: { duration: 1 }
            }}
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
            <motion.div 
                className="grid gap-3"
                style={{
                    gridTemplateColumns: 'repeat(9, minmax(120px, 1fr))',
                    gridTemplateRows: 'repeat(8, 56px)', 
                    transformStyle: 'preserve-3d'
                }}
                layout 
            >
                <AnimatePresence mode="popLayout"> 
                    {cells.map((cell) => {
                        const colors = getColors(cell.colorTheme, cell.type);
                        const finalOpacity = cell.isDimmed ? 0.15 : (cell.customOpacity ?? 1);
                        
                        return (
                            <motion.div
                                layout="position" 
                                key={cell.key}
                                
                                initial={{ opacity: 0, scale: 0.5, z: 50 }}
                                animate={{ 
                                    opacity: finalOpacity, 
                                    scale: 1, 
                                    z: 0,
                                    backgroundColor: colors.bg,
                                    borderColor: colors.border,
                                    filter: cell.isDimmed ? 'blur(2px)' : 'blur(0px)',
                                }}
                                exit={{ opacity: 0, scale: 0.2, z: -100, filter: "blur(10px)" }}
                                
                                transition={{ 
                                    layout: { type: 'spring', stiffness: 45, damping: 14, mass: 0.8 }, 
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4 },
                                    filter: { duration: 0.3 }
                                }}

                                style={{
                                    gridColumnStart: cell.gridCol,
                                    gridColumnEnd: "span 1",
                                    gridRowStart: cell.gridRow,
                                    gridRowEnd: "span 1",
                                    zIndex: cell.type === 'header' ? 50 : 20,
                                    willChange: "transform, opacity, grid-area" 
                                }}
                                
                                className={`
                                    relative flex flex-col items-center justify-center 
                                    rounded-md border backdrop-blur-sm shadow-sm
                                    font-mono select-none overflow-hidden px-2
                                    ${cell.type === 'header' ? 'font-bold tracking-wider' : 'font-normal text-sm'}
                                    ${colors.text}
                                    ${cell.colName === 'order_uid' && step >= Step.ON && step < Step.GROUP_BY ? 'ring-1 ring-fuchsia-500/50 bg-fuchsia-500/10' : ''} 
                                `}
                            >
                                {cell.type === 'header' && (
                                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
                                        cell.colorTheme === 'cyan' ? 'from-cyan-400 to-transparent' : 
                                        cell.colorTheme === 'fuchsia' ? 'from-fuchsia-400 to-transparent' :
                                        cell.colorTheme === 'emerald' ? 'from-emerald-400 to-transparent' :
                                        'from-slate-400 to-transparent'
                                    }`} />
                                )}
                                
                                <span className="relative z-10 truncate max-w-full">{cell.content}</span>
                                {cell.subtitle && (
                                  <span
                                    className="
                                      relative z-10
                                      text-sm
                                      font-normal
                                      tracking-tight
                                      mt-0.5
                                      uppercase
                                      text-slate-300
                                      opacity-80
                                    "
                                  >
                                    {cell.subtitle}
                                  </span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    </div>
  );
};
