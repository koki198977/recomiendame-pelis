<template>
  <div class="bg-surface-950 min-h-screen text-white pb-24">
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-10">
      <header class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
            Panel de control
          </p>
          <h1 class="text-3xl font-semibold sm:text-4xl">Administración de usuarios</h1>
          <p class="text-sm text-white/60 max-w-2xl">
            Gestiona las cuentas registradas en la plataforma. Puedes revisar el total de usuarios,
            buscar información clave y eliminar accesos si es necesario.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="refresh"
          >
            <span v-if="!isLoading">Actualizar</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg
                class="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Cargando…
            </span>
          </button>
          <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            Página {{ currentPage }} · {{ pageSize }} por página
          </div>
        </div>
      </header>

      <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article class="card space-y-3 p-6">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Usuarios totales</p>
          <p class="text-3xl font-semibold text-white">
            <span v-if="isLoading" class="animate-pulse text-white/60">···</span>
            <span v-else>{{ totalUsers }}</span>
          </p>
          <p class="text-xs text-white/60">Cuentas registradas en la plataforma.</p>
        </article>
        <article class="card space-y-3 p-6">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Página actual</p>
          <p class="text-3xl font-semibold text-white">
            <span v-if="isLoading" class="animate-pulse text-white/60">···</span>
            <span v-else>{{ visibleUsers.length }}</span>
          </p>
          <p class="text-xs text-white/60">
            Usuarios visibles en esta página.
          </p>
        </article>
        <article class="card space-y-3 p-6">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Administradores</p>
          <p class="text-3xl font-semibold text-white">
            <span v-if="isLoading" class="animate-pulse text-white/60">···</span>
            <span v-else>{{ adminUsers }}</span>
          </p>
          <p class="text-xs text-white/60">Cuentas con privilegios elevados.</p>
        </article>
        <article class="card space-y-3 p-6">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Última actualización</p>
          <p class="text-lg font-semibold text-white">
            <span v-if="lastUpdated">{{ lastUpdated }}</span>
            <span v-else class="text-white/60">Sin datos</span>
          </p>
          <p class="text-xs text-white/60">
            Registro de la última sincronización exitosa.
          </p>
        </article>
      </section>

      <section class="card overflow-hidden border border-white/10">
        <header class="flex flex-col gap-3 border-b border-white/5 bg-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold text-white">Usuarios</h2>
            <p class="text-xs text-white/60">
              Consulta la información clave y gestiona los accesos.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isLoading || currentPage === 1"
              @click="goToPrev"
            >
              ← Anterior
            </button>
            <button
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isLoading || !hasMore"
              @click="goToNext"
            >
              Siguiente →
            </button>
          </div>
        </header>

        <div v-if="errorMessage" class="px-6 py-4 text-sm text-red-200 bg-red-500/10 border-b border-red-500/20">
          {{ errorMessage }}
        </div>
        <div v-if="infoMessage" class="px-6 py-4 text-sm text-accent-100 bg-accent-500/10 border-b border-accent-500/20">
          {{ infoMessage }}
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-white/10">
            <thead>
              <tr class="bg-white/5 text-left text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                <th scope="col" class="px-6 py-3">Correo</th>
                <th scope="col" class="px-6 py-3">Nombre</th>
                <th scope="col" class="px-6 py-3">Rol</th>
                <th scope="col" class="px-6 py-3">Creado</th>
                <th scope="col" class="px-6 py-3">Último acceso</th>
                <th scope="col" class="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-if="isLoading && !visibleUsers.length">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-white/60">
                  Cargando usuarios…
                </td>
              </tr>
              <tr v-else-if="!visibleUsers.length">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-white/60">
                  No hay usuarios para mostrar en esta página.
                </td>
              </tr>
              <tr
                v-for="user in visibleUsers"
                :key="user.rowKey"
                class="hover:bg-white/5 transition"
              >
                <td class="px-6 py-4 text-sm">
                  <div class="flex flex-col">
                    <span class="font-semibold text-white">{{ user.email || "—" }}</span>
                    <span v-if="user.id" class="text-xs text-white/40">
                      {{ user.id }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-white/80">
                  {{ user.name || "Sin nombre" }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                    :class="user.isAdmin ? 'border-accent-400 text-accent-200 bg-accent-500/10' : 'border-white/10 text-white/70 bg-white/5'"
                  >
                    {{ user.isAdmin ? "Admin" : "Usuario" }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-white/70">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 text-sm text-white/70">
                  {{ formatDate(user.lastLoginAt) || "Sin registro" }}
                </td>
                <td class="px-6 py-4 text-right text-sm">
                  <button
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!user.id || user.isAdmin || deletingId === user.id || isCurrentUser(user)"
                    @click="deleteUser(user)"
                  >
                    <span v-if="deletingId === user.id">
                      Eliminando…
                    </span>
                    <span v-else>
                      Eliminar
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthToken, useAuthUser } from "~/composables/useAuthState";

interface AdminUser {
  id: string | number | null;
  email: string;
  name: string;
  createdAt?: string | Date | null;
  lastLoginAt?: string | Date | null;
  isAdmin: boolean;
  rowKey: string;
}

const authToken = useAuthToken();
const authUser = useAuthUser();
const config = useRuntimeConfig();

const allUsers = ref<AdminUser[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const infoMessage = ref("");
const deletingId = ref<string | number | null>(null);
const lastUpdated = ref<string | null>(null);

const pageSize = 20;
const currentPage = ref(1);

const visibleUsers = computed<AdminUser[]>(() => {
  const start = (currentPage.value - 1) * pageSize;
  return allUsers.value.slice(start, start + pageSize);
});

const totalUsers = computed(() => allUsers.value.length);

const hasMore = computed(
  () => currentPage.value * pageSize < allUsers.value.length
);

const adminUsers = computed(
  () => allUsers.value.filter((user) => user.isAdmin).length
);

const formatDate = (value?: string | Date | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const generateRowKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const normalizeUsers = (payload: any): AdminUser[] => {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.users)
    ? payload.users
    : Array.isArray(payload?.results)
    ? payload.results
    : [];

  return raw
    .map((entry: any) => {
      const id =
        entry?.id ??
        entry?._id ??
        entry?.userId ??
        entry?.uuid ??
        entry?.externalId ??
        null;
      const email =
        entry?.email ??
        entry?.username ??
        entry?.mail ??
        entry?.contact ??
        "";
      const name =
        entry?.name ??
        entry?.fullName ??
        entry?.displayName ??
        entry?.givenName ??
        entry?.profile?.name ??
        "";
      const createdAt = entry?.createdAt ?? entry?.created_at ?? entry?.created;
      const lastLoginAt =
        entry?.lastLoginAt ??
        entry?.last_login_at ??
        entry?.lastAccess ??
        entry?.lastSeen;
      const isAdminEntry =
        Boolean(entry?.admin) ||
        Boolean(entry?.isAdmin) ||
        entry?.role === "admin" ||
        entry?.role === "ADMIN" ||
        entry?.roles?.includes?.("admin");

      const rowKey = `${id ?? email ?? generateRowKey()}`;

      return {
        id,
        email,
        name,
        createdAt,
        lastLoginAt,
        isAdmin: isAdminEntry,
        rowKey,
      } as AdminUser;
    })
    .filter((entry: AdminUser) => entry.email || entry.id);
};

const fetchUsers = async () => {
  if (!authToken.value) {
    errorMessage.value = "Tu sesión expiró. Vuelve a iniciar sesión.";
    return;
  }

  if (!config.public?.apiBase) {
    errorMessage.value = "No se definió NUXT_PUBLIC_API_BASE. Revisa la configuración.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  infoMessage.value = "";

  try {
    const response = await $fetch<any>("/users", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: "application/json",
      },
    });

    const normalized = normalizeUsers(response);
    allUsers.value = normalized;
    currentPage.value = 1;
    lastUpdated.value = new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar la lista de usuarios.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async (user: AdminUser) => {
  if (!authToken.value || !user?.id) return;
  const confirmed = window.confirm(
    `¿Seguro que deseas eliminar a ${user.email || "este usuario"}? Esta acción no se puede deshacer.`
  );
  if (!confirmed) return;

  deletingId.value = user.id;
  errorMessage.value = "";
  infoMessage.value = "";

  try {
    await $fetch(`/users/${user.id}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: "application/json",
      },
    });

    allUsers.value = allUsers.value.filter((item) => item.id !== user.id);

    if (
      allUsers.value.length &&
      (currentPage.value - 1) * pageSize >= allUsers.value.length
    ) {
      currentPage.value = Math.max(currentPage.value - 1, 1);
    }

    infoMessage.value = `Usuario ${user.email || user.id} eliminado correctamente.`;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos eliminar este usuario.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    deletingId.value = null;
  }
};

const refresh = () => fetchUsers();
const goToNext = () => {
  if (!hasMore.value || isLoading.value) return;
  currentPage.value += 1;
};
const goToPrev = () => {
  if (currentPage.value === 1 || isLoading.value) return;
  currentPage.value -= 1;
};

const isCurrentUser = (user: AdminUser) => {
  const currentEmail = authUser.value?.email;
  const currentId = authUser.value?.id ?? authUser.value?._id;
  return Boolean(
    (currentEmail && user.email && currentEmail === user.email) ||
      (currentId && user.id && currentId === user.id)
  );
};

let initialized = false;

watch(
  () => [authToken.value, authUser.value],
  async ([token, user]) => {
    if (!process.client || initialized) return;
    if (!token) return;
    if (!user?.admin) {
      initialized = true;
      await navigateTo("/dashboard");
      return;
    }
    initialized = true;
    await fetchUsers();
  },
  { immediate: true }
);

onMounted(() => {
  if (!process.client) return;
  if (!initialized && authToken.value && authUser.value?.admin) {
    initialized = true;
    fetchUsers();
  }
});

useHead({
  title: "Administración de usuarios | Recomiéndame",
});
</script>
