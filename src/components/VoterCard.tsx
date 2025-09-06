import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge
} from "@chakra-ui/react";

export function VoterCard() {
  return (
    <Card.Root bg="white" borderColor="gray.200" borderWidth="1px">
      <Card.Body>
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Proposition 42</Heading>
            <Badge colorScheme="green" variant="solid">
              ✓ Passed
            </Badge>
          </HStack>

          <Text color="gray.600">
            A ballot measure to improve public transportation infrastructure
            and reduce traffic congestion in the metropolitan area.
          </Text>

          <HStack justify="space-between" pt={2}>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" fontWeight="bold" color="green.500">
                Yes: 67%
              </Text>
              <Box w="100px" h="2" bg="gray.200" rounded="full">
                <Box w="67%" h="full" bg="green.500" rounded="full" />
              </Box>
            </VStack>

            <VStack align="start" gap={1}>
              <Text fontSize="sm" fontWeight="bold" color="red.500">
                No: 33%
              </Text>
              <Box w="100px" h="2" bg="gray.200" rounded="full">
                <Box w="33%" h="full" bg="red.500" rounded="full" />
              </Box>
            </VStack>
          </HStack>

          <Button variant="outline" size="sm">
            View Details
          </Button>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
