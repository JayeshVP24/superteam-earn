import { BellIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  HStack,
  Image,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import axios from 'axios';
import { franc } from 'franc';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TiTick } from 'react-icons/ti';

import { tokenList } from '@/constants';
import type { Bounty } from '@/interface/bounty';
import type { Notifications } from '@/interface/user';
import { userStore } from '@/store/user';
import { dayjs } from '@/utils/dayjs';

import { EarningModal } from '../modals/earningModal';

type ListingSectionProps = {
  children?: React.ReactNode;
  title: string;
  sub: string;
  emoji: string;
  type: 'bounties' | 'grants';
  url?: string;
  all?: boolean;
};

export const ListingSection = ({
  children,
  title,
  sub,
  emoji,
  type,
}: ListingSectionProps) => {
  const router = useRouter();

  return (
    <Box
      display={
        router.query.category
          ? router.query.category === (type as string) ||
            router.query.category === 'all'
            ? 'block'
            : 'none'
          : 'block'
      }
      w={{ md: '100%', base: '98%' }}
      mx={'auto'}
      my={10}
    >
      <HStack
        align="center"
        justify="space-between"
        mb={4}
        pb={3}
        borderBottom="2px solid"
        borderBottomColor="#E2E8F0"
      >
        <Flex align={'center'}>
          <Image
            w={'1.4375rem'}
            h={'1.4375rem'}
            mr={'0.75rem'}
            alt="emoji"
            src={emoji}
          />
          <Text
            color={'#334155'}
            fontSize={{ base: 14, md: 16 }}
            fontWeight={'600'}
          >
            {title}
          </Text>
          <Text
            display={['none', 'none', 'block', 'block']}
            mx={3}
            color={'brand.slate.300'}
            fontSize={'xxs'}
          >
            |
          </Text>
          <Text
            display={['none', 'none', 'block', 'block']}
            color={'brand.slate.400'}
            fontSize={{ base: 12, md: 14 }}
          >
            {sub}
          </Text>
        </Flex>
      </HStack>
      <Flex direction={'column'} rowGap={'1'}>
        {children}
      </Flex>
    </Box>
  );
};

export const ListingsCardSkeleton = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  return (
    <Box px={isMobile ? 1 : 4} py={4} borderRadius={5}>
      <Flex align={'center'} justify={'space-between'} w="100%">
        <Flex w="100%" h={isMobile ? 14 : 16}>
          <Skeleton
            w={isMobile ? '4.2rem' : '4.6rem'}
            h={isMobile ? 14 : 16}
            mr={isMobile ? 3 : 5}
            rounded={5}
          />
          <Flex justify={'space-between'} direction={'column'} w={'full'}>
            <Skeleton w="60%" h="3.5" />
            <Skeleton
              w="130px"
              h="3"
              fontSize={{ md: 'sm', base: 'xs' }}
              noOfLines={1}
            />
            <Flex gap={2}>
              <SkeletonText
                w="56px"
                fontSize={{ md: 'sm', base: 'xs' }}
                noOfLines={1}
              />
              <Skeleton
                w="48px"
                fontSize={{ md: 'sm', base: 'xs' }}
                noOfLines={1}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex align={'center'} gap={2}>
          <SkeletonCircle size={'4'} />
          <Skeleton w="54px" h="14px" noOfLines={1} />
        </Flex>
      </Flex>
    </Box>
  );
};

export const ListingCard = ({ bounty }: { bounty: Bounty }) => {
  const {
    rewardAmount,
    deadline,
    type,
    sponsor,
    title,
    token,
    slug,
    applicationType,
    isWinnersAnnounced,
    description,
  } = bounty;
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const isBounty = type === 'bounty';

  const langCode = franc(description);
  console.log(langCode);

  const isEnglish = description
    ? langCode === 'eng' || langCode === 'sco'
    : true;

  if (!isEnglish) {
    return null;
  }

  return (
    <>
      <Link
        as={NextLink}
        px={isMobile ? 1 : 4}
        py={4}
        borderRadius={5}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.100',
        }}
        href={`/listings/${type}/${slug}`}
      >
        <Flex
          align="center"
          justify="space-between"
          w={{ base: '100%', md: 'brand.120' }}
        >
          <Flex w="100%" h={isMobile ? 14 : 16}>
            <Image
              w={isMobile ? 14 : 16}
              h={isMobile ? 14 : 16}
              mr={isMobile ? 3 : 5}
              alt={sponsor?.name}
              rounded={5}
              src={
                sponsor?.logo
                  ? sponsor.logo.replace(
                      '/upload/',
                      '/upload/c_scale,w_128,h_128,f_auto/',
                    )
                  : `${router.basePath}/assets/logo/sponsor-logo.png`
              }
            />
            <Flex justify={'space-between'} direction={'column'} w={'full'}>
              <Text
                color="brand.slate.700"
                fontSize={['xs', 'xs', 'md', 'md']}
                fontWeight={600}
                _hover={{
                  textDecoration: 'underline',
                }}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Text>
              <Text
                w={'full'}
                color={'brand.slate.500'}
                fontSize={{ md: 'sm', base: 'xs' }}
              >
                {sponsor?.name}
              </Text>
              <Flex align={'center'} gap={isMobile ? 1 : 3}>
                <>
                  <Image
                    h="4"
                    ml={isBounty ? -0.5 : 0}
                    alt={type}
                    src={
                      isBounty
                        ? '/assets/icons/bolt.svg'
                        : '/assets/icons/briefcase.svg'
                    }
                  />
                  <Text
                    ml={isMobile ? '-1' : isBounty ? '-3' : '-2.5'}
                    color="gray.500"
                    fontSize={['x-small', 'xs', 'xs', 'xs']}
                    fontWeight={500}
                  >
                    {type && type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </>
                <Text
                  color={'brand.slate.300'}
                  fontSize={['xx-small', 'xs', 'sm', 'sm']}
                >
                  |
                </Text>
                <Text
                  color={'gray.500'}
                  fontSize={['x-small', 'xs', 'xs', 'xs']}
                >
                  {dayjs().isBefore(dayjs(deadline))
                    ? applicationType === 'rolling'
                      ? 'Rolling Deadline'
                      : `Closing ${dayjs(deadline).fromNow()}`
                    : `Closed ${dayjs(deadline).fromNow()}`}
                </Text>
                {dayjs().isBefore(dayjs(deadline)) && !isWinnersAnnounced && (
                  <>
                    <Text
                      color={'brand.slate.300'}
                      fontSize={['xx-small', 'xs', 'sm', 'sm']}
                    >
                      |
                    </Text>
                    <Flex align={'center'} gap={1}>
                      <Circle bg="#16A35F" size="8px" />
                      <Text
                        display={['none', 'none', 'block', 'block']}
                        color="#16A35F"
                        fontSize="12px"
                      >
                        Open
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex align={'center'} justify="start" mr={3}>
            <Image
              w={4}
              h={4}
              mr={1}
              alt={token}
              rounded="full"
              src={
                tokenList.find((ele) => {
                  return ele.tokenSymbol === token;
                })?.icon
              }
            />
            <Flex align="baseline" gap={1}>
              <Text
                color={'brand.slate.600'}
                fontSize={['xs', 'xs', 'md', 'md']}
                fontWeight={'600'}
              >
                {rewardAmount?.toLocaleString()}
              </Text>
              <Text
                color={'gray.400'}
                fontSize={['xs', 'xs', 'md', 'md']}
                fontWeight={500}
              >
                {token}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

interface GrantsProps {
  title: string;
  sponsorName?: string;
  logo?: string;
  rewardAmount?: number;
  token?: string;
  slug: string;
  short_description?: string;
}
export const GrantsCard = ({
  title,
  logo,
  rewardAmount,
  sponsorName,
  slug,
  short_description,
}: GrantsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  return (
    <>
      <Link
        as={NextLink}
        px={isMobile ? 1 : 4}
        py={4}
        borderRadius={5}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.100',
        }}
        href={`/grants/${slug}`}
      >
        <Flex
          align="center"
          justify="space-between"
          w={{ base: '100%', md: 'brand.120' }}
        >
          <Flex justify="start" h={isMobile ? 14 : 16}>
            <Image
              w={isMobile ? 14 : 16}
              h={isMobile ? 14 : 16}
              mr={isMobile ? 3 : 5}
              alt={'company logo'}
              rounded={5}
              src={
                logo
                  ? logo.replace(
                      '/upload/',
                      '/upload/c_scale,w_128,h_128,f_auto/',
                    )
                  : `assets/home/placeholder/ph1.png`
              }
            />
            <Flex justify={'space-between'} direction={'column'} w={'full'}>
              <Text
                color="brand.slate.700"
                fontSize={['xs', 'xs', 'md', 'md']}
                fontWeight="600"
                _hover={{
                  textDecoration: 'underline',
                }}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Text>
              <Text
                color="brand.slate.500"
                fontSize={['xs', 'xs', 'sm', 'sm']}
                fontWeight="400"
              >
                {sponsorName}
              </Text>

              {rewardAmount && (
                <Text
                  mr={3}
                  color={'brand.slate.500'}
                  fontSize={['10px', '10px', 'sm', 'sm']}
                  style={
                    isMobile
                      ? {
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }
                      : undefined
                  }
                >
                  {short_description}
                </Text>
              )}
            </Flex>
          </Flex>

          <Button
            minW={24}
            h={isMobile ? 7 : 9}
            px={6}
            fontSize={['xs', 'xs', 'sm', 'sm']}
            variant="outlineSecondary"
          >
            Apply
          </Button>
        </Flex>
      </Link>
    </>
  );
};

type CategoryAssetsType = {
  [key: string]: {
    bg: string;
    desc: string;
    color: string;
    icon: string;
  };
};

export const CategoryBanner = ({ type }: { type: string }) => {
  const { userInfo } = userStore();

  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    setIsSubscribed(
      userInfo?.notifications?.some((e) => e.label === type) || false,
    );
  }, [userInfo, type]);

  const categoryAssets: CategoryAssetsType = {
    Design: {
      bg: `/assets/category_assets/bg/design.png`,
      color: '#FEFBA8',
      desc: 'If delighting users with eye-catching designs is your jam, you should check out the earning opportunities below.',
      icon: '/assets/category_assets/icon/design.png',
    },
    Content: {
      bg: `/assets/category_assets/bg/content.png`,
      color: '#FEB8A8',
      desc: 'If you can write insightful essays, make stunning videos, or create killer memes, the opportunities below are calling your name.',
      icon: '/assets/category_assets/icon/content.png',
    },
    Development: {
      desc: "If building robust applications and scalable solutions is your forte, don't miss out on the earning opportunities listed below",
      bg: `/assets/category_assets/bg/frontend.png`,
      color: '#FEA8EB',
      icon: '/assets/category_assets/icon/backend.png',
    },
    // Hyperdrive: {
    //   bg: `/assets/category_assets/bg/contract.png`,
    //   desc: 'Discover and apply to additional Hyperdrive prizes. Increase your chances of winning something at the online global hackathon!',
    //   color: '#000',
    //   icon: '/assets/category_assets/icon/solana_logo_green.svg',
    // },
  };

  const updateNotification = async (notification: Notifications[]) => {
    try {
      const { data, status } = await axios.post(
        `/api/user/updateNotification`,
        {
          notification,
        },
      );
      if (status !== 200) {
        return null;
      }
      return data.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleNotification = async () => {
    setLoading(true);

    let updatedNotifications = [...(userInfo?.notifications ?? [])];
    let subscriptionMessage = '';

    if (!userInfo?.isTalentFilled) {
      onOpen();
      setLoading(false);
      return;
    }

    if (isSubscribed) {
      updatedNotifications = updatedNotifications.filter(
        (e) => e.label !== type,
      );
      subscriptionMessage = "You've been unsubscribed from this category";
      setIsSubscribed(false);
    } else {
      updatedNotifications.push({ label: type, timestamp: Date.now() });
      subscriptionMessage = "You've been subscribed to this category";
      setIsSubscribed(true);
    }

    await updateNotification(updatedNotifications);

    setLoading(false);
    toast.success(subscriptionMessage);
  };

  return (
    <>
      {isOpen && <EarningModal isOpen={isOpen} onClose={onClose} />}
      <Flex
        direction={{ md: 'row', base: 'column' }}
        w={{ md: 'brand.120', base: '100%' }}
        h={{ md: '7.375rem', base: 'fit-content' }}
        mx={'auto'}
        mb={8}
        p={6}
        bg={`url('${categoryAssets[type]?.bg}')`}
        bgSize={'cover'}
        rounded={10}
      >
        <Center
          w={14}
          h={14}
          mr={3}
          bg={categoryAssets[type]?.color}
          rounded={'md'}
        >
          <Image h="18" alt="Category icon" src={categoryAssets[type]?.icon} />
        </Center>
        <Box w={{ md: '60%', base: '100%' }} mt={{ base: 4, md: '0' }}>
          <Text fontFamily={'var(--font-serif)'} fontWeight={'700'}>
            {/* {type === 'Hyperdrive'
              ? 'Hyperdrive Side Tracks & Local Prizes'
              : */}
            {type}
          </Text>
          <Text
            mb={6}
            color="brand.slate.500"
            fontSize="small"
            // {...(type === 'Hyperdrive'
            //   ? { w: ['full', 'full', 'full', '130%', '130%'] }
            //   : {})}
          >
            {categoryAssets[type]?.desc}
          </Text>
        </Box>
        <Button
          my={{ base: '', md: 'auto' }}
          mt={{ base: 4, md: '' }}
          ml={{ base: '', md: 'auto' }}
          px={4}
          color={'brand.slate.500'}
          fontWeight={'500'}
          bg={'white'}
          borderWidth={'1px'}
          borderColor={'brand.slate.400'}
          isLoading={loading}
          leftIcon={isSubscribed ? <TiTick /> : <BellIcon />}
          onClick={handleNotification}
          variant="solid"
        >
          {isSubscribed ? 'Subscribed' : 'Notify Me'}
        </Button>
        <Toaster />
      </Flex>
    </>
  );
};
