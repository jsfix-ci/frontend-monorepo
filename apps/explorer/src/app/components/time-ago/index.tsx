import { formatDistanceToNowStrict } from 'date-fns';
import { t } from '@vegaprotocol/react-helpers';
import { useEffect, useState } from 'react';

interface TimeAgoProps {
  date: string;
}

export const TimeAgo = ({ date, ...props }: TimeAgoProps) => {
  const [distanceToNow, setDistanceToNow] = useState(
    formatDistanceToNowStrict(new Date(date))
  );

  useEffect(() => {
    const int = setInterval(() => {
      date && setDistanceToNow(formatDistanceToNowStrict(new Date(date)));
    }, 500);
    return () => clearInterval(int);
  }, [setDistanceToNow, date]);

  if (!date || date.length === 0) {
    return <>{t('Date unknown')}</>;
  }

  return <span {...props}>{t(`${distanceToNow} ago`)}</span>;
};
