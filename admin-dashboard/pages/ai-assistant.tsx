import React from 'react';
import { Box, Container } from '@mui/material';
import KentTradersAIAssistant from '../components/ai/KentTradersAIAssistant';

export default function AIAssistantPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <KentTradersAIAssistant />
      </Box>
    </Container>
  );
}
