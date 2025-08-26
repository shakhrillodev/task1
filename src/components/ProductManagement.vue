<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { ref, reactive, computed, h } from "vue";
import DataTable from "./DataTable.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Label from "@/components/ui/Label.vue";
import ConfirmActionDialog from "./ConfirmActionDialog.vue";

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: "in_stock" | "out_of_stock" | "discontinued";
  createdAt?: string;
}

interface ProductPayload {
  name: string;
  category: string;
  price?: number;
  stockQuantity?: number;
  status: "in_stock" | "out_of_stock" | "discontinued";
}

// Data
const products = ref<Product[]>([
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 2599,
    stockQuantity: 20,
    status: "in_stock",
    createdAt: "2025-08-01T10:15:00Z",
  },
  {
    id: 2,
    name: "Gaming Keyboard",
    category: "Electronics",
    price: 89,
    stockQuantity: 0,
    status: "out_of_stock",
    createdAt: "2025-07-20T09:45:00Z",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    price: 199,
    stockQuantity: 35,
    status: "discontinued",
    createdAt: "2025-08-10T12:30:00Z",
  },
]);

const loading = ref(false);
const showProductForm = ref(false);
const showDeleteDialog = ref(false);
const editingProduct = ref<Product | null>(null);
const productToDelete = ref<Product | null>(null);

// Form data
const productForm = reactive<ProductPayload>({
  name: "",
  category: "",
  price: undefined,
  stockQuantity: undefined,
  status: "in_stock",
});

// Formatter
const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

// Table setup
const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: ({getValue }) => formatter.format(getValue()),
  }),
  columnHelper.accessor("stockQuantity", {
    header: "Stock Quantity",
    cell: ({ getValue }) => {
      const amount = getValue()
      return h("div", {
        class: `product_amount ${amount < 10 ? "product_amount-small" : ''}`
      }, [
        h("span", null, {
          default: ()=>amount
        })
      ])
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue()
      return h("div", { class: `product_status product_status-${v}` }, {
        default: ()=>{
          switch (v) {
          case "in_stock":
            return "In Stock";
          case "out_of_stock":
            return "Out of stock";
          case "discontinued":
            return "Discontinue";
        }
        }
      });
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => {
      return h("div", { class: "flex gap-2" }, [
        h(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => editProduct(original),
          },
          () => "Edit"
        ),
        h(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => confirmDelete(original),
          },
          () => "Delete"
        ),
      ]);
    },
  }),
];

// Computed
const isEditing = computed(() => editingProduct.value !== null);

// Methods
const resetForm = () => {
  productForm.name = "";
  productForm.category = "";
  productForm.price = undefined;
  productForm.stockQuantity = undefined;
  productForm.status = "in_stock";
};

const openProductForm = () => {
  resetForm();
  editingProduct.value = null;
  showProductForm.value = true;
};

const editProduct = (product: Product) => {
  editingProduct.value = product;
  productForm.name = product.name;
  productForm.category = product.category;
  productForm.price = product.price;
  productForm.stockQuantity = product.stockQuantity;
  productForm.status = product.status;
  showProductForm.value = true;
};

const saveProduct = () => {
  if (!productForm.name || !productForm.price) return;

  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    if (isEditing.value && editingProduct.value) {
      // Update existing product
      const index = products.value.findIndex(
        (u) => u.id === editingProduct.value!.id
      );
      if (index !== -1) {
        products.value[index] = {
          ...editingProduct.value,
          name: productForm.name,
          category: productForm.category,
          price: productForm.price!,
          status: productForm.status,
          stockQuantity: productForm.stockQuantity!,
        };
      }
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.value.map((u) => u.id)) + 1,
        name: productForm.name,
        category: productForm.category,
        price: productForm.price!,
        status: productForm.status,
        stockQuantity: productForm.stockQuantity!,
        createdAt: new Date().toISOString().split("T")[0],
      };
      products.value.push(newProduct);
    }
    products.value = [...products.value];
    loading.value = false;
    showProductForm.value = false;
    editingProduct.value = null;
  }, 1000);
};

const confirmDelete = (product: Product) => {
  productToDelete.value = product;
  showDeleteDialog.value = true;
};

const deleteProduct = () => {
  if (productToDelete.value) {
    products.value = products.value.filter(
      (u) => u.id !== productToDelete.value!.id
    );
    productToDelete.value = null;
    showDeleteDialog.value = false;
  }
};

const cancelDelete = () => {
  productToDelete.value = null;
  showDeleteDialog.value = false;
};

const cancelForm = () => {
  showProductForm.value = false;
  editingProduct.value = null;
  resetForm();
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Product Management</h1>
        <p class="text-gray-500">Manage products, statuses, and prices</p>
      </div>
      <Button @click="openProductForm" class="bg-blue-600 hover:bg-blue-700">
        Add New Product
      </Button>
    </div>

    <!-- Product Table -->
    <div class="bg-white rounded-lg shadow">
      <DataTable :data="products" :columns="columns" :loading="false" />
    </div>

    <!-- Product Form Modal -->
    <div
      v-if="showProductForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? "Edit Product" : "Add New Product" }}
        </h2>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <Label for="name">Name</Label>
            <Input
              id="name"
              v-model="productForm.name"
              placeholder="Enter product name"
              required
              class="mt-1"
            />
          </div>

          <div>
            <Label for="category">Email</Label>
            <Input
              id="category"
              v-model="productForm.category"
              placeholder="Enter category"
              required
              class="mt-1"
            />
          </div>

          <div>
            <Label for="price">Price</Label>
            <Input
              id="price"
              v-model="productForm.price"
              placeholder="Enter price"
              required
              type="number"
              class="mt-1"
            />
          </div>

          <div>
            <Label for="quantity">Stock Quantity</Label>
            <Input
              id="quantity"
              v-model="productForm.stockQuantity"
              placeholder="Enter stock quantity"
              required
              type="number"
              class="mt-1"
            />
          </div>

          <div>
            <Label for="role">Status</Label>
            <select
              id="role"
              v-model="productForm.status"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="discontinued">Discontinue</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <Button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {{
                loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Product"
                    : "Create Product"
              }}
            </Button>
            <Button
              type="button"
              variant="outline"
              @click="cancelForm"
              class="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmActionDialog
      v-model:open="showDeleteDialog"
      title="Delete Product"
      :description="`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`"
      action-variant="destructive"
      @continue-action="deleteProduct"
      @cancel-action="cancelDelete"
    />
  </div>
</template>
<style>
.product_status{
  text-align: center;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  text-wrap: nowrap;
}

.product_status-in_stock{
  background-color: rgba(159, 124, 255, 0.342);
  color: rgb(0, 4, 255);
}

.product_status-out_of_stock{
  background-color: rgba(189, 175, 113, 0.425);
  color: rgb(74, 141, 19);
}

.product_status-discontinued{
  background-color: rgba(223, 165, 163, 0.384);
  color: rgb(255, 17, 0);
}

.product_amount{
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 25px;
  min-width: 25px;
  min-height: 25px;
  background-color: rgba(236, 206, 125, 0.479);
  color: rgb(23, 128, 46);
  border-radius: 9999px;
}

.product_amount-small{
  background-color: rgba(255, 120, 120, 0.24);
  color: rgb(255, 0, 0);
}

</style>