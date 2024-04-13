import { Link } from '@chakra-ui/react';

import { type CommentType } from '@/interface/comments';
import { truncateString } from '@/utils/truncateString';

interface Props {
  listingSlug: string;
  listingType: string;
  value: string;
  type: CommentType;
  isAnnounced: boolean;
  submissionId?: string;
}

function parseComment(comment: string) {
  const parts = comment.split(/(\s+|@[\w]+)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith('@')) {
      return { type: 'mention', value: part };
    }
    return { type: 'text', value: part };
  });
}

export const CommentParser = ({
  value,
  type,
  submissionId,
  listingSlug,
  listingType,
  isAnnounced,
}: Props) => {
  const parsedComment = parseComment(value);
  if (type === 'SUBMISSION' && submissionId && isAnnounced)
    return (
      <>
        {value} -{' '}
        <Link
          color="brand.purple"
          href={`/listings/${listingType}/${listingSlug}/submission/${submissionId}`}
        >
          check it out!
        </Link>
      </>
    );
  return (
    <>
      {parsedComment.map((part, index) =>
        part.type === 'mention' ? (
          <Link
            key={index}
            color="brand.purple"
            href={`/t/${part.value.substring(1)}`}
          >
            {truncateString(part.value, 12)}
          </Link>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
};
