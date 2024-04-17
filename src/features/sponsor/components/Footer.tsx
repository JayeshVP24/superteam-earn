import { Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';

import { userStore } from '@/store/user';

import { fontSize, maxW2, padding } from '../utils';

export function Footer() {
  const { data: session } = useSession();

  const { userInfo } = userStore();

  const posthog = usePostHog();

  function getStartedWhere(authenticated: boolean, isSponsor: boolean) {
    if (!authenticated) return '/new/sponsor';
    if (!isSponsor) return '/new/sponsor';
    return '/dashboard/listings/?open=1';
  }

  return (
    <VStack
      gap={8}
      maxW={maxW2}
      mx={padding}
      mt={'3rem'}
      mb="6rem"
      px={padding}
      py={{ base: '1.275rem', lg: '2rem', xl: '3rem' }}
      lineHeight={1.2}
      bg="#4F46E5"
      rounded="0.5rem"
    >
      <Text
        color="white"
        fontSize={fontSize}
        fontWeight={600}
        textAlign={'center'}
      >
        Where Solana teams come to get sh*t done
      </Text>
      <NextLink
        href={getStartedWhere(!!session, !!userInfo?.currentSponsorId)}
        className="ph-no-capture"
        onClick={() => posthog.capture('clicked_footer_get_started')}
      >
        <Button
          w="12.5rem"
          h="3.125rem"
          mx="auto"
          px={'2.5rem'}
          color="#4F46E5"
          fontSize="1.125rem"
          bg="white"
          borderRadius="0.625rem"
          variant={'solid'}
        >
          Get Started
        </Button>
      </NextLink>
    </VStack>
  );
}
