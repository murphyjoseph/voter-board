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
import { ClientHome } from "@/components/ClientHome";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {

  const supabase = createClient()

  const { data: boards } = await (await supabase).from('boards').select()
  const { data: ideas } = await (await supabase).from('ideas').select('*')

  return <ClientHome ideas={ideas} boards={boards} />;
}
