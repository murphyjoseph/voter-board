import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  SimpleGrid,
  Separator,
} from "@chakra-ui/react";
import { IdeasSection } from "@/components/IdeasSection";
import { DebugInfo } from "@/components/DebugInfo";
import { AppConceptsShowcase } from "@/components/AppConceptsShowcase";
import { UIPatternShowcase } from "@/components/UIPatternShowcase";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {

  const supabase = createClient()

  const { data: boards } = await (await supabase).from('boards').select()
  const { data: ideas } = await (await supabase).from('ideas').select('*')

  return (
    <Container maxW="container.xl" p={16} margin="0 auto">
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to the Hackreation Voter Board
          </Heading>
          <Heading size="md" mb={2} color="gray.600">
            Theme: Everyday Tools Reimagined (view below for examples and more information)
          </Heading>
          {/* MULTIPLE BOARDS NOT YET SUPPORTED */}
          {/* <DebugInfo boards={boards} ideas={ideas} /> */}
          {/* <SimpleGrid columns={1} gap={6}>
            {boards?.map((board) => (
              <Box key={board.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                <Heading size="md">{board.title}</Heading>
                <Text>{board.description}</Text>
              </Box>
            ))}
          </SimpleGrid> */}
        </Box>

        {/* Ideas Section */}
        <IdeasSection ideas={ideas} boardId={boards?.[0]?.id} />

        <Separator my={8} />

        {/* App Concepts Showcase */}
        <AppConceptsShowcase />

        <Separator my={8} />

        {/* UI Pattern Showcase */}
        <UIPatternShowcase />
      </VStack>
    </Container>
  );
}
