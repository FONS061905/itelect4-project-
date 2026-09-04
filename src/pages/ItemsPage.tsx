import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import ComplaintCard from "../components/ComplaintCard";
import type { ApiItem, ApiUser, NewItem } from "../models";
import { ItemStatus } from "../models";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchItems, fetchUsers, createItem } from "../api/client";
import { itemSchema } from "../schemas/itemSchema";
import type { ItemFormValues } from "../schemas/itemSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ItemsPage() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const { data: users } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Moved to the store -- both the nav bar's theme and this search box
  // are settings ABOUT the app, not state owned by one component.
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  // useForm holds the values, runs the Zod schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    mode: "onBlur",
    defaultValues: { title: "", type: "lost", location: "", reporterId: "" },
  });

  const addItem = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      reset();
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: ItemFormValues): void => {
    const newItem: NewItem = {
      ...values,
      description: "",
      status: ItemStatus.Reported,
      createdAt: new Date().toISOString(),
    };
    addItem.mutate(newItem);
  };

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  const filteredItems = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Items</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex flex-wrap items-end gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              {...register("title")}
              aria-invalid={errors.title ? true : undefined}
              placeholder="Item title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="type" className="text-foreground">Type</Label>
            <select
              id="type"
              {...register("type")}
              className="h-8 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="location" className="text-foreground">Location</Label>
            <Input
              id="location"
              {...register("location")}
              aria-invalid={errors.location ? true : undefined}
              placeholder="Location"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reporterId" className="text-foreground">Reporter</Label>
            <select
              id="reporterId"
              {...register("reporterId")}
              className="h-8 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- reporter --</option>
              {(users ?? []).map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.reporterId && (
              <p className="text-sm text-red-600">{errors.reporterId.message}</p>
            )}
          </div>

          <Button type="submit" disabled={addItem.isPending}>
            {addItem.isPending ? "Saving..." : "Report Item"}
          </Button>
        </div>
      </form>
      {addItem.isError && (
        <p className="mb-4 text-sm text-red-700">{addItem.error.message}</p>
      )}

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items"
        className="mb-3 w-full max-w-sm rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Previous search: {previousSearch}</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`}>
            <ComplaintCard item={item} variant="compact" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
