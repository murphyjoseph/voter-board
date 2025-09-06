'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  VStack,
  Input,
  Text,
  Container
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_BOARD_PASSWORD || "hackreation2025";
const SESSION_KEY = "voter_board_authenticated";

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem(SESSION_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    setPassword('');
    setError('');
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">
          <Text>Loading...</Text>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxW="md" py={20}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="blue.600">
              🗳️ Voter Board
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Enter the password to access the board
            </Text>
          </Box>

          <Card.Root>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                  <Heading size="md" textAlign="center">
                    Access Required
                  </Heading>

                  {error && (
                    <Box p={3} bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md">
                      <Text color="red.600" fontSize="sm">{error}</Text>
                    </Box>
                  )}

                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    autoFocus
                  />

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    disabled={!password.trim()}
                  >
                    Access Board
                  </Button>

                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Password required to participate in voting
                  </Text>
                </VStack>
              </form>
            </Card.Body>
          </Card.Root>

          <Box textAlign="center" fontSize="sm" color="gray.400">
            <Text>Powered by Hackreation • Secure Access</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  // User is authenticated, show the main content with logout option
  return (
    <Box>
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
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>
      {children}
    </Box>
  );
}
