import { Box, Container } from "@mui/material";
import LoanForm from "./LoanForm";
import LoanStats from "./LoanStats";
import LoanTable from "./LoanTable";

export default function LoanDashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth={false}>
        <LoanStats />
      </Container>
      <Container maxWidth={false}>
        <LoanForm />
      </Container>
      <Container maxWidth={false}>
        <LoanTable />
      </Container>
    </Box>
  );
}
