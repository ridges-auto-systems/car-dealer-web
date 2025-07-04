// lib/hooks/useUsers.ts - COMPLETE VERSION with useUserForm

import { useCallback, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchUsers,
  createUser,
  fetchUser,
  updateUser,
  deleteUser,
  fetchUserStats,
  fetchSalesReps,
  setFilters,
  resetFilters,
  toggleUserSelection,
  clearSelection,
  setCurrentUser,
  clearError,
} from "@/lib/store/slices/user.slice";
import type {
  UserFilters,
  CreateUserData,
  UpdateUserData,
  User,
} from "@/lib/types/user.type";

// ============================================================================
// SELECTORS
// ============================================================================

export const selectUsers = (state: any) => state.users.users;
export const selectCurrentUser = (state: any) => state.users.currentUser;
export const selectUserFilters = (state: any) => state.users.filters;
export const selectSelectedUsers = (state: any) => state.users.selectedUsers;
export const selectUserStats = (state: any) => state.users.stats;
export const selectSalesReps = (state: any) => state.users.salesReps;
export const selectUserLoading = (state: any) => state.users.isLoading;
export const selectUserError = (state: any) => state.users.error;
export const selectUserPagination = (state: any) => state.users.pagination;

// ============================================================================
// MAIN USEUSERS HOOK - SAFE VERSION
// ============================================================================

export const useUsers = () => {
  const dispatch = useAppDispatch();

  // 🔥 PREVENT MULTIPLE CALLS
  const fetchingRef = useRef(false);
  const lastFiltersRef = useRef<string>("");

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NO CONDITIONALS
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const filters = useAppSelector(selectUserFilters);
  const selectedUsers = useAppSelector(selectSelectedUsers);
  const stats = useAppSelector(selectUserStats);
  const salesReps = useAppSelector(selectSalesReps);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const pagination = useAppSelector(selectUserPagination);

  // MEMOIZED COMPUTED VALUES
  const computed = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];

    return {
      hasUsers: safeUsers.length > 0,
      hasSelectedUsers: selectedUsers.length > 0,
      selectedCount: selectedUsers.length,
      totalUsers: pagination?.totalRecords || 0,
      hasNextPage: pagination?.hasNext || false,
      hasPrevPage: pagination?.hasPrev || false,
      activeUsers: safeUsers.filter((user) => user.isActive),
      inactiveUsers: safeUsers.filter((user) => !user.isActive),
      customers: safeUsers.filter((user) => user.role === "CUSTOMER"),
      salesRepsUsers: safeUsers.filter((user) => user.role === "SALES_REP"),
      salesTeam: safeUsers.filter((user) =>
        ["SALES_REP", "SALES_MANAGER"].includes(user.role)
      ),
      adminUsers: safeUsers.filter((user) =>
        ["ADMIN", "MANAGER", "SUPER_ADMIN"].includes(user.role)
      ),
      admins: safeUsers.filter((user) => user.role === "ADMIN"),
      managers: safeUsers.filter((user) => user.role === "MANAGER"),
      selectedUsersData: selectedUsers
        .map((id: any) => safeUsers.find((user) => user.id === id))
        .filter(Boolean) as User[],
    };
  }, [users, selectedUsers, pagination]);

  // 🔥 SAFE FETCH FUNCTION - PREVENTS INFINITE LOOPS
  const safeFetchUsers = useCallback(
    async (filters?: UserFilters) => {
      const filtersString = JSON.stringify(filters || {});

      // Prevent multiple calls with same filters
      if (fetchingRef.current && lastFiltersRef.current === filtersString) {
        console.log(
          "⚠️ fetchUsers: Already fetching with same filters, skipping"
        );
        return;
      }

      // Prevent too frequent calls
      if (fetchingRef.current) {
        console.log("⚠️ fetchUsers: Already fetching, waiting...");
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (fetchingRef.current) {
          console.log("⚠️ fetchUsers: Still fetching after wait, aborting");
          return;
        }
      }

      fetchingRef.current = true;
      lastFiltersRef.current = filtersString;

      console.log("🔄 fetchUsers: Starting fetch with filters:", filters);

      try {
        const result = await dispatch(fetchUsers(filters || {}));
        console.log("✅ fetchUsers: Success");
        return result;
      } catch (error) {
        console.error("❌ fetchUsers: Error:", error);
        throw error;
      } finally {
        fetchingRef.current = false;
      }
    },
    [dispatch]
  );

  // MEMOIZED ACTIONS
  const actions = useMemo(
    () => ({
      // 🔥 SAFE FETCH FUNCTIONS
      fetchUsers: safeFetchUsers,
      loadUsers: safeFetchUsers,

      // Create user
      createUser: (userData: CreateUserData) => dispatch(createUser(userData)),

      // Get single user
      loadUser: (id: string) => dispatch(fetchUser(id)),
      fetchUser: (id: string) => dispatch(fetchUser(id)),

      // Update user
      updateUser: (id: string, updates: UpdateUserData) =>
        dispatch(updateUser({ id, updates })),

      // Delete user
      deleteUser: (id: string) => dispatch(deleteUser(id)),
      removeUser: (id: string) => dispatch(deleteUser(id)),

      // Stats
      loadStats: () => dispatch(fetchUserStats()),
      fetchStats: () => dispatch(fetchUserStats()),

      // Sales reps
      loadSalesReps: () => dispatch(fetchSalesReps()),
      fetchSalesReps: () => dispatch(fetchSalesReps()),

      // Filters - 🔥 DON'T AUTO-FETCH ON FILTER CHANGE
      setFilters: (newFilters: Partial<UserFilters>) => {
        console.log("🔧 setFilters called:", newFilters);
        dispatch(setFilters(newFilters));
        // DON'T automatically fetch - let component decide when to fetch
      },
      resetFilters: () => {
        console.log("🔧 resetFilters called");
        dispatch(resetFilters());
        // DON'T automatically fetch - let component decide when to fetch
      },

      // Selection
      toggleSelection: (userId: string) =>
        dispatch(toggleUserSelection(userId)),
      clearSelection: () => dispatch(clearSelection()),

      // Current user
      setCurrentUser: (user: User | null) => dispatch(setCurrentUser(user)),

      // Error handling
      clearError: () => dispatch(clearError()),

      // Manual refresh
      refetch: safeFetchUsers,
    }),
    [dispatch, safeFetchUsers]
  );

  // MEMOIZED HELPERS
  const helpers = useMemo(
    () => ({
      isSelected: (userId: string) => selectedUsers.includes(userId),
      getUserById: (id: string) => {
        const safeUsers = Array.isArray(users) ? users : [];
        return safeUsers.find((user) => user.id === id);
      },
      getUsersByRole: (role: string) => {
        const safeUsers = Array.isArray(users) ? users : [];
        return safeUsers.filter((user) => user.role === role);
      },
      getActiveUsers: () => computed.activeUsers,
      getInactiveUsers: () => computed.inactiveUsers,
      getUserFullName: (user: User) => `${user.firstName} ${user.lastName}`,
      searchUsers: (searchTerm: string) => {
        const safeUsers = Array.isArray(users) ? users : [];
        return safeUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },
    }),
    [users, selectedUsers, computed.activeUsers, computed.inactiveUsers]
  );

  // 🔥 DEBUGGING INFO
  console.log("🔍 useUsers state:", {
    usersCount: users?.length || 0,
    isLoading,
    error: error || "none",
    isFetching: fetchingRef.current,
  });

  // RETURN ALL PROPERTIES
  return {
    // State
    users: Array.isArray(users) ? users : [],
    currentUser,
    filters,
    selectedUsers,
    stats,
    salesReps,
    isLoading: isLoading || false,
    error,
    pagination: pagination || {
      totalRecords: 0,
      hasNext: false,
      hasPrev: false,
    },

    // Computed values
    ...computed,

    // Actions
    ...actions,

    // Helpers
    ...helpers,
  };
};

// ============================================================================
// 🔥 MISSING HOOK: useUserForm - For form-specific operations
// ============================================================================

export const useUserForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.users);

  const createUserHandler = useCallback(
    async (userData: CreateUserData): Promise<any> => {
      try {
        console.log("🔄 useUserForm: Creating user with data:", userData);
        const result = (await dispatch(
          createUser(userData)
        )) as unknown as ReturnType<typeof createUser>;

        if (createUser.fulfilled.match(result)) {
          console.log("✅ useUserForm: User created successfully");
          return result.payload;
        } else if (createUser.rejected.match(result)) {
          console.error(
            "❌ useUserForm: Create failed:",
            (result as any).payload
          );
          throw new Error(
            ((result as any).payload as string) || "Failed to create user"
          );
        }

        return (result as any).payload;
      } catch (err: any) {
        console.error("❌ useUserForm: Create error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateUserHandler = useCallback(
    async (id: string, updates: UpdateUserData): Promise<any> => {
      try {
        console.log("🔄 useUserForm: Updating user:", id, updates);
        const result = await dispatch(updateUser({ id, updates }));

        if (updateUser.fulfilled.match(result)) {
          console.log("✅ useUserForm: User updated successfully");
          return result.payload;
        } else if (updateUser.rejected.match(result)) {
          console.error("❌ useUserForm: Update failed:", result.payload);
          throw new Error(
            (result.payload as string) || "Failed to update user"
          );
        }

        return result;
      } catch (err: any) {
        console.error("❌ useUserForm: Update error:", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
    createUser: createUserHandler,
    updateUser: updateUserHandler,
    isLoading: isLoading || false,
    error,
  };
};

// ============================================================================
// ADDITIONAL HOOKS - For specific use cases
// ============================================================================

export const useUser = (userId?: string) => {
  const dispatch = useAppDispatch();
  const { users, currentUser, isLoading, error } = useAppSelector(
    (state) => state.users
  );

  const user = useMemo(() => {
    if (userId) {
      const safeUsers = Array.isArray(users) ? users : [];
      return safeUsers.find((u) => u.id === userId) || currentUser;
    }
    return currentUser;
  }, [userId, users, currentUser]);

  const actions = useMemo(
    () => ({
      load: () => userId && dispatch(fetchUser(userId)),
      update: (updates: UpdateUserData) =>
        userId && dispatch(updateUser({ id: userId, updates })),
      remove: () => userId && dispatch(deleteUser(userId)),
      setCurrent: () => user && dispatch(setCurrentUser(user)),
      activate: () =>
        userId &&
        dispatch(updateUser({ id: userId, updates: { isActive: true } })),
      deactivate: () =>
        userId &&
        dispatch(updateUser({ id: userId, updates: { isActive: false } })),
    }),
    [dispatch, userId, user]
  );

  return {
    user,
    isLoading: isLoading || false,
    error,
    ...actions,
  };
};

export const useUserStats = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectUserStats);
  const isLoading = useAppSelector(selectUserLoading);

  const refreshStats = useCallback(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  return {
    stats,
    isLoading: isLoading || false,
    refreshStats,
  };
};

export const useSalesReps = () => {
  const dispatch = useAppDispatch();
  const salesReps = useAppSelector(selectSalesReps);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const loadSalesReps = useCallback(() => {
    dispatch(fetchSalesReps());
  }, [dispatch]);

  return {
    salesReps,
    isLoading: isLoading || false,
    error,
    loadSalesReps,
  };
};
