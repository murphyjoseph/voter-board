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
import { DebugInfo } from "@/components/DebugInfo";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {

  const supabase = createClient()

  const { data: boards } = await (await supabase).from('boards').select()
  const { data: ideas } = await (await supabase).from('ideas').select('*')

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to the Hackreation Voter Board
          </Heading>
          <DebugInfo boards={boards} ideas={ideas} />
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
        <IdeasSection ideas={ideas} boardId={boards?.[0]?.id} />
      </VStack>
    </Container>
  );
}
