'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack
} from "@chakra-ui/react";
import { Provider as ChakraProvider } from "@/theme/provider";

function MaintenanceIcon() {
  return (
    <Box fontSize="6xl" color="orange.400">
      🔧
    </Box>
  );
}

function MaintenanceContent() {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <VStack
          gap={6}
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          p={8}
          textAlign="center"
          boxShadow="lg"
        >
          <MaintenanceIcon />

          <VStack gap={3}>
            <Heading size="lg" color="orange.500">
              Under Maintenance
            </Heading>

            <Text fontSize="lg" color="gray.600" lineHeight="tall">
              We're currently performing scheduled maintenance to improve your experience.
            </Text>

            <Text fontSize="md" color="gray.500">
              We'll be back online shortly. Thank you for your patience!
            </Text>
          </VStack>

          <Box
            borderTop="1px"
            borderColor="gray.200"
            pt={4}
            w="full"
          >
            <Text fontSize="sm" color="gray.400">
              If you need immediate assistance, please contact support.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default function MaintenancePage() {
  return (
    <ChakraProvider>
      <MaintenanceContent />
    </ChakraProvider>
  );
}
