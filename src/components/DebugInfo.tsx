'use client'

import { Box, Text, VStack, Badge } from "@chakra-ui/react";

interface Board {
  id: string;
  title: string;
  description: string;
}

interface DebugInfoProps {
  boards: Board[] | null;
  ideas: any[] | null;
}

export function DebugInfo({ boards, ideas }: DebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box p={4} bg="gray.50" borderRadius="md" fontSize="sm">
      <VStack align="start" gap={2}>
        <Text fontWeight="bold">Debug Info:</Text>
        <Text>
          Boards: {boards?.length || 0} 
          {boards?.[0] && (
            <Badge ml={2} colorScheme="blue">
              Default: {boards[0].id.substring(0, 8)}...
            </Badge>
          )}
        </Text>
        <Text>Ideas: {ideas?.length || 0}</Text>
        {boards && boards.length === 0 && (
          <Text color="orange.600">⚠️ No boards found - will create default</Text>
        )}
      </VStack>
    </Box>
  );
}
