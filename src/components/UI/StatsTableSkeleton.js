"use client";

import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function StatsTableSkeleton({
  showStats = true,
  statsCount = 3,
  showTable = true,
  tableColumns = 6,
  rows = 5,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {showStats && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: `repeat(${Math.min(statsCount, 3)}, 1fr)`,
            },
            gap: 2,
            mb: 4,
          }}
        >
          {Array.from({ length: statsCount }).map((_, index) => (
            <Card
              key={index}
              sx={{
                background: "rgba(30,30,35,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="80%" height={40} />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {showTable && (
        <Card
          sx={{
            background: "rgba(30,30,35,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
            width: "100%",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              <Skeleton variant="text" width={200} />
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton variant="rectangular" width={120} height={40} />
                <Skeleton variant="rectangular" width={120} height={40} />
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "none",
                background: "transparent",
                width: "100%",
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  width: "100%",
                  minWidth: 700,
                  tableLayout: "auto",
                }}
              >
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    background: "rgba(30,30,35,1)",
                    zIndex: 2,
                  }}
                >
                  <TableRow>
                    {Array.from({ length: tableColumns }).map((_, index) => (
                      <TableCell key={index} sx={{ py: 2 }}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: tableColumns }).map(
                        (_, colIndex) => (
                          <TableCell key={colIndex} sx={{ py: 2 }}>
                            <Skeleton
                              variant="text"
                              width={colIndex === 0 ? "60%" : "90%"}
                            />
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
