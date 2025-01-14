import { DApp, TOKEN_PROPOSAL, useLinks } from '@vegaprotocol/environment';
import { t } from '@vegaprotocol/react-helpers';
import { Schema } from '@vegaprotocol/types';
import { ExternalLink, Intent, Notification } from '@vegaprotocol/ui-toolkit';
import { useUpdateProposal } from '../lib';

type AssetProposalNotificationProps = {
  assetId?: string;
};
export const AssetProposalNotification = ({
  assetId,
}: AssetProposalNotificationProps) => {
  const tokenLink = useLinks(DApp.Token);
  const { data: proposal } = useUpdateProposal({
    id: assetId,
    proposalType: Schema.ProposalType.TYPE_UPDATE_ASSET,
  });

  if (proposal) {
    const proposalLink = tokenLink(
      TOKEN_PROPOSAL.replace(':id', proposal.id || '')
    );
    return (
      <Notification
        intent={Intent.Warning}
        message={t('Changes have been proposed for this asset')}
        testId="asset-proposal-notification"
      >
        <ExternalLink href={proposalLink}>{t('View proposal')}</ExternalLink>
      </Notification>
    );
  }

  return null;
};
