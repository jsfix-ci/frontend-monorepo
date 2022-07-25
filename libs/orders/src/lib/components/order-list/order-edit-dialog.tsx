import {
  addDecimal,
  t,
  addDecimalsFormatNumber,
} from '@vegaprotocol/react-helpers';
import { OrderType } from '@vegaprotocol/types';
import { FormGroup, Input, InputError, Button } from '@vegaprotocol/ui-toolkit';
import { useForm } from 'react-hook-form';
import Icon from 'react-syntax-highlighter';
import { OrderDialogWrapper } from '@vegaprotocol/wallet';
import type { Order } from '@vegaprotocol/wallet';

interface OrderEditDialogProps {
  title: string;
  order: Order | null;
  edit: (body: Order) => Promise<unknown>;
}

interface FormFields {
  entryPrice: string;
}

export const OrderEditDialog = ({
  order,
  title,
  edit,
}: OrderEditDialogProps) => {
  const headerClassName = 'text-h5 font-bold text-black dark:text-white';
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormFields>({
    defaultValues: {
      entryPrice: order?.price
        ? addDecimal(order?.price, order?.market?.decimalPlaces ?? 0)
        : '',
    },
  });
  if (!order) return null;
  return (
    <OrderDialogWrapper title={title} icon={<Icon name="hand-up" size={20} />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {order.market && (
          <div>
            <p className={headerClassName}>{t(`Market`)}</p>
            <p>{t(`${order.market.name}`)}</p>
          </div>
        )}
        {order.type === OrderType.Limit && order.market && (
          <div>
            <p className={headerClassName}>{t(`Last price`)}</p>
            <p>
              {addDecimalsFormatNumber(order.price, order.market.decimalPlaces)}
            </p>
          </div>
        )}
        <div>
          <p className={headerClassName}>{t(`Amount remaining`)}</p>
          <p
            className={
              order.side === 'Buy'
                ? 'text-dark-green dark:text-vega-green'
                : 'text-red dark:text-vega-red'
            }
          >
            {order.side === 'Buy' ? '+' : '-'}
            {order.size}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
        <form
          onSubmit={handleSubmit(async (data) => {
            await edit({
              ...order,
              price: data.entryPrice,
            });
          })}
          data-testid="edit-order"
        >
          <FormGroup label={t('Entry price')} labelFor="entryPrice">
            <Input
              {...register('entryPrice', { required: t('Required') })}
              id="entryPrice"
              type="text"
            />
            {errors.entryPrice?.message && (
              <InputError intent="danger" className="mt-4">
                {errors.entryPrice.message}
              </InputError>
            )}
          </FormGroup>
          <Button variant="primary" type="submit">
            {t('Update')}
          </Button>
        </form>
      </div>
    </OrderDialogWrapper>
  );
};