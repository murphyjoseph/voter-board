'use client'

import { Button, Box, Container, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="blue.50" borderBottom="1px" borderColor="blue.200" px={4} py={2}>
      <Container maxW="container.xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="blue.700">
            🔓 Authenticated Access
          </Text>
          <Button
            size="xs"
            variant="ghost"
            colorScheme="blue"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
