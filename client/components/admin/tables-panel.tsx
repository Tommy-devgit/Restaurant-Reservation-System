"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createTable,
  deleteTable,
  getTables,
  updateTable,
} from "@/services/table-service";

const tableSchema = z.object({
  tableNumber: z.string().min(1),
  capacity: z.coerce.number().int().min(1).max(20),
});

type TableForm = z.infer<typeof tableSchema>;

export function TablesPanel({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: () => getTables(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const form = useForm<TableForm>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: "",
      capacity: 2,
    },
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
  };

  const createMutation = useMutation({
    mutationFn: (values: TableForm) =>
      createTable({
        restaurantId,
        tableNumber: values.tableNumber,
        capacity: values.capacity,
      }),
    onSuccess: () => {
      form.reset();
      void refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (tableId: string) => deleteTable(tableId),
    onSuccess: () => {
      void refresh();
    },
  });

  const increaseCapacityMutation = useMutation({
    mutationFn: (params: { tableId: string; capacity: number }) =>
      updateTable(params.tableId, { capacity: params.capacity + 1 }),
    onSuccess: () => {
      void refresh();
    },
  });

  const onSubmit = form.handleSubmit((values) => createMutation.mutate(values));

  return (
    <section className="space-y-5">
      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Add Table</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Table number"
            {...form.register("tableNumber")}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
          <input
            type="number"
            min={1}
            max={20}
            {...form.register("capacity")}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
          >
            Add Table
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Current Tables</h3>
        {isLoading ? (
          <p className="mt-3 text-slate-600">Loading tables...</p>
        ) : !data?.length ? (
          <p className="mt-3 text-slate-600">No tables found.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {data.map((table) => (
              <article
                key={table.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3"
              >
                <div>
                  <p className="font-semibold text-slate-800">Table {table.tableNumber}</p>
                  <p className="text-sm text-slate-600">Capacity: {table.capacity}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      increaseCapacityMutation.mutate({
                        tableId: table.id,
                        capacity: table.capacity,
                      })
                    }
                    className="rounded-full border border-cyan-300 px-3 py-1 text-cyan-700 hover:bg-cyan-50"
                  >
                    + Capacity
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(table.id)}
                    className="rounded-full border border-rose-300 px-3 py-1 text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
