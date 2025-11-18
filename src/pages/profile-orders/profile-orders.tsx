import { getFeedLoading, getUserOrders } from '@selectors';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchUserOrders } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);
  const loading = useSelector(getFeedLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
