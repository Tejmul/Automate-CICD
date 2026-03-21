import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../../lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.products.categories(),
    select: (data) => data.categories || [],
  });
}

export function useProducts({ q, category, limit = 24, skip = 0 } = {}) {
  return useQuery({
    queryKey: [
      "products",
      { q: q || null, category: category || null, limit, skip },
    ],
    queryFn: () =>
      category
        ? api.products.byCategory({ category, limit, skip })
        : api.products.list({ q, limit, skip }),
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),
    queryFn: () => api.products.get(id),
  });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => api.cart.get(),
    select: (data) => data.items || [],
  });
}

export function useCartWithProducts() {
  const cart = useCart();
  const productQueries = useQueries({
    queries: (cart.data || []).map((it) => ({
      queryKey: ["product", it.productId],
      queryFn: () => api.products.get(it.productId),
      enabled: cart.isSuccess,
      staleTime: 60_000,
    })),
  });

  const productsById = new Map();
  for (const q of productQueries) {
    if (q.data?.id) productsById.set(q.data.id, q.data);
  }

  const lines =
    cart.data?.map((it) => {
      const p = productsById.get(it.productId);
      const unitPrice = p?.price ?? 0;
      return {
        ...it,
        product: p,
        unitPrice,
        lineTotal: unitPrice * it.quantity,
      };
    }) || [];

  const subtotal = lines.reduce(
    (sum, l) => sum + (Number.isFinite(l.lineTotal) ? l.lineTotal : 0),
    0,
  );
  const isLoading = cart.isLoading || productQueries.some((q) => q.isLoading);
  const error = cart.error || productQueries.find((q) => q.error)?.error;

  return { items: cart.data || [], lines, subtotal, isLoading, error };
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api.wishlist.get(),
    select: (data) => data.items || [],
  });
}

export function useWishlistWithProducts() {
  const wishlist = useWishlist();
  const productQueries = useQueries({
    queries: (wishlist.data || []).map((it) => ({
      queryKey: ["product", it.productId],
      queryFn: () => api.products.get(it.productId),
      enabled: wishlist.isSuccess,
      staleTime: 60_000,
    })),
  });

  const products = productQueries.map((q) => q.data).filter(Boolean);
  const isLoading =
    wishlist.isLoading || productQueries.some((q) => q.isLoading);
  const error = wishlist.error || productQueries.find((q) => q.error)?.error;
  const productIds = new Set((wishlist.data || []).map((x) => x.productId));

  return { items: wishlist.data || [], products, productIds, isLoading, error };
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
    select: (data) => data.orders || [],
  });
}

export function useCartActions() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["cart"] });

  const add = useMutation({
    mutationFn: ({ productId, quantity }) =>
      api.cart.add({ productId, quantity }),
    onSuccess: invalidate,
  });
  const setQuantity = useMutation({
    mutationFn: ({ productId, quantity }) =>
      api.cart.setQuantity({ productId, quantity }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (productId) => api.cart.remove(productId),
    onSuccess: invalidate,
  });
  const clear = useMutation({
    mutationFn: () => api.cart.clear(),
    onSuccess: invalidate,
  });

  return { add, setQuantity, remove, clear };
}

export function useWishlistActions() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["wishlist"] });

  const add = useMutation({
    mutationFn: (productId) => api.wishlist.add(productId),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (productId) => api.wishlist.remove(productId),
    onSuccess: invalidate,
  });

  return { add, remove };
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.orders.create({ currency: "USD" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
