import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from "../services/api/productsApi";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [active, setActive] = useState("true");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  async function handleSaveCategory(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.id,
          {
            name,
            active: active === "true",
          },
        );

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === updatedCategory.id
              ? updatedCategory
              : category,
          ),
        );
      } else {
        const createdCategory = await createCategory({
          name,
          active: active === "true",
        });

        setCategories((currentCategories) => [
          ...currentCategories,
          createdCategory,
        ]);
      }

      setName("");
      setActive("true");
      setEditingCategory(null);
      setShowForm(false);
      setError("");
    } catch {
      if (editingCategory) {
        setError("No se pudo actualizar la categoría.");
      } else {
        setError("No se pudo crear la categoría.");
      }
    }
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setActive(category.active ? "true" : "false");
    setShowForm(true);
    setError("");
  }

  async function handleDeleteCategory(categoryId: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?",
    );

    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== categoryId,
        ),
      );

      setError("");
    } catch {
      setError("No se pudo eliminar la categoría.");
    }
  }

  function handleNewCategory() {
    setEditingCategory(null);
    setName("");
    setActive("true");
    setError("");
    setShowForm(true);
  }

  function handleCancelForm() {
    setName("");
    setActive("true");
    setEditingCategory(null);
    setShowForm(false);
    setError("");
  }

  if (loading) {
    return (
      <section className="categories-page">
        <p>Cargando categorías...</p>
      </section>
    );
  }

  if (error && categories.length === 0) {
    return (
      <section className="categories-page">
        <p>{error}</p>
      </section>
    );
  }

  if (showForm) {
    return (
      <section className="categories-page">
        <div className="page-heading">
          <div>
            <h1>
              {editingCategory
                ? "Editar categoría"
                : "Nueva categoría"}
            </h1>

            <p>
              {editingCategory
                ? "Actualiza la información de la categoría."
                : "Ingresa la información de la nueva categoría."}
            </p>
          </div>
        </div>

        <section className="product-form">
          <form onSubmit={handleSaveCategory}>
            <div className="form-group">
              <label htmlFor="category-name">
                Nombre
              </label>

              <input
                id="category-name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category-active">
                Estado
              </label>

              <select
                id="category-active"
                name="active"
                value={active}
                onChange={(event) =>
                  setActive(event.target.value)
                }
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>

            {error && <p>{error}</p>}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancelForm}
              >
                Cancelar
              </button>

              <button type="submit">
                {editingCategory
                  ? "Actualizar categoría"
                  : "Guardar categoría"}
              </button>
            </div>
          </form>
        </section>
      </section>
    );
  }

  return (
    <section className="categories-page">
      <div className="page-heading">
        <div>
          <h1>Categorías</h1>

          <p>
            Administra las categorías de tu negocio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewCategory}
        >
          Nueva categoría
        </button>
      </div>

      {error && <p>{error}</p>}

      <div className="categories-list">
        {categories.map((category) => (
          <article
            className="category-card"
            key={category.id}
          >
            <div>
              <h2>{category.name}</h2>

              <span>
                {category.active ? "Activa" : "Inactiva"}
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  handleEditCategory(category)
                }
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteCategory(category.id)
                }
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}