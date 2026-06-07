"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCategoryForm } from "@/components/product-category-form";
import { ProductCategoryList } from "@/components/product-category-list";
import { MaterialCategoryForm } from "@/components/material-category-form";
import { MaterialCategoryList } from "@/components/material-category-list";

export default function PanelCategoriasPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Categorías</h1>
        <p className="text-sm text-muted-foreground">
          Organiza el inventario de materiales y el catálogo de productos.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-semibold">Materiales</h2>
          <MaterialCategoryForm
            trigger={
              <Button size="sm">
                <Plus className="size-4" />
                Nueva categoría
              </Button>
            }
          />
        </div>
        <MaterialCategoryList />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-semibold">Productos</h2>
          <ProductCategoryForm
            trigger={
              <Button size="sm">
                <Plus className="size-4" />
                Nueva categoría
              </Button>
            }
          />
        </div>
        <ProductCategoryList />
      </section>
    </div>
  );
}
