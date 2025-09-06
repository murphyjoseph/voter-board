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
import { useState } from "react";
import { useRouter } from "next/navigation";

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_BOARD_PASSWORD || "hackreation2025";

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use location.replace for a more reliable redirect
        location.replace('/');
      } else {
        setError(data.error || 'Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={20} margin="0 auto">
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
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  disabled={!password.trim() || isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Access Board'}
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
