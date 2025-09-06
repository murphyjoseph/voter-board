import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  Card,
  SimpleGrid,
  Flex
} from "@chakra-ui/react";
import { VoterCard } from "@/components/VoterCard";
import { IdeaCard } from "@/components/IdeaCard";
import { NewIdeaForm } from "@/components/NewIdeaForm";
import { IdeasSection } from "@/components/IdeasSection";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {

  const supabase = createClient(cookies())

  const { data: boards } = await supabase.from('boards').select()
  const { data: ideas } = await supabase.from('ideas').select('*')

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to Hackreation Voter Board
          </Heading>
          <SimpleGrid columns={1} gap={6}>
            {boards?.map((board) => (
              <Box key={board.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                <Heading size="md">{board.title}</Heading>
                <Text>{board.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Ideas Section */}
        <IdeasSection ideas={ideas} />
      </VStack>
    </Container>
  );
}
