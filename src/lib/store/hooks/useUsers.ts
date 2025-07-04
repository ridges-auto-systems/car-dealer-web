// lib/hooks/useUsers.ts - FIXED VERSION
import { useCallback, useMemo } from "react";
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
// MAIN HOOK - FIXED: All hooks called at top level
// ============================================================================

export const useUsers = () => {
  const dispatch = useAppDispatch();

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
    // Safely access users array
    const safeUsers = Array.isArray(users) ? users : [];

    return {
      hasUsers: safeUsers.length > 0,
      hasSelectedUsers: selectedUsers.length > 0,
      selectedCount: selectedUsers.length,
      totalUsers: pagination?.totalRecords || 0,
      hasNextPage: pagination?.hasNext || false,
      hasPrevPage: pagination?.hasPrev || false,

      // Get specific users
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

      // Selected users data
      selectedUsersData: selectedUsers
        .map((id: any) => safeUsers.find((user) => user.id === id))
        .filter(Boolean) as User[],
    };
  }, [users, selectedUsers, pagination]);

  // MEMOIZED ACTIONS
  const actions = useMemo(
    () => ({
      // Fetch users
      loadUsers: (filters?: UserFilters) =>
        dispatch(fetchUsers(filters ?? ({} as UserFilters))),

      // Create user
      createUser: (userData: CreateUserData) => dispatch(createUser(userData)),

      // Get single user
      loadUser: (id: string) => dispatch(fetchUser(id)),

      // Update user
      updateUser: (id: string, updates: UpdateUserData) =>
        dispatch(updateUser({ id, updates })),

      // Delete user
      deleteUser: (id: string) => dispatch(deleteUser(id)),
      removeUser: (id: string) => dispatch(deleteUser(id)),

      // Additional actions expected by the component
      toggleUserStatus: (id: string) => {
        const user =
          computed.activeUsers.find((u) => u.id === id) ||
          computed.inactiveUsers.find((u) => u.id === id);
        if (user) {
          return dispatch(
            updateUser({ id, updates: { isActive: !user.isActive } })
          );
        }
        return Promise.resolve();
      },

      bulkUpdateUsers: (userIds: string[], updates: UpdateUserData) => {
        return Promise.all(
          userIds.map((id) => dispatch(updateUser({ id, updates })))
        );
      },

      exportUsers: () => {
        // Placeholder for export functionality
        console.log("Export users functionality not implemented yet");
      },

      // Stats
      loadStats: () => dispatch(fetchUserStats()),

      // Sales reps
      loadSalesReps: () => dispatch(fetchSalesReps()),

      // Filters
      setFilters: (newFilters: Partial<UserFilters>) =>
        dispatch(setFilters(newFilters)),
      resetFilters: () => dispatch(resetFilters()),

      // Selection
      toggleSelection: (userId: string) =>
        dispatch(toggleUserSelection(userId)),
      clearSelection: () => dispatch(clearSelection()),

      // Current user
      setCurrentUser: (user: User | null) => dispatch(setCurrentUser(user)),

      // Error handling
      clearError: () => dispatch(clearError()),
    }),
    [dispatch, computed.activeUsers, computed.inactiveUsers]
  );

  // MEMOIZED QUICK ACTIONS
  const activateUser = useCallback(
    async (id: string) => {
      return dispatch(updateUser({ id, updates: { isActive: true } }));
    },
    [dispatch]
  );

  const deactivateUser = useCallback(
    async (id: string) => {
      return dispatch(updateUser({ id, updates: { isActive: false } }));
    },
    [dispatch]
  );

  const changeUserRole = useCallback(
    async (id: string, role: any) => {
      return dispatch(updateUser({ id, updates: { role } }));
    },
    [dispatch]
  );

  const updatePreferredContact = useCallback(
    async (id: string, preferredContact: string) => {
      return dispatch(updateUser({ id, updates: { preferredContact } }));
    },
    [dispatch]
  );

  const quickActions = useMemo(
    () => ({
      activateUser,
      deactivateUser,
      changeUserRole,
      updatePreferredContact,
    }),
    [activateUser, deactivateUser, changeUserRole, updatePreferredContact]
  );

  // MEMOIZED FILTER SHORTCUTS
  const filterShortcuts = useMemo(
    () => ({
      showActive: () => dispatch(setFilters({ isActive: true, page: 1 })),
      showInactive: () => dispatch(setFilters({ isActive: false, page: 1 })),
      showCustomers: () => dispatch(setFilters({ role: "CUSTOMER", page: 1 })),
      showSalesReps: () => dispatch(setFilters({ role: "SALES_REP", page: 1 })),
      showAdmins: () => dispatch(setFilters({ role: "ADMIN", page: 1 })),
      showManagers: () => dispatch(setFilters({ role: "MANAGER", page: 1 })),
      searchUsers: (search: string) =>
        dispatch(setFilters({ search, page: 1 })),
      sortBy: (sortBy: any, sortOrder: "asc" | "desc" = "desc") =>
        dispatch(setFilters({ sortBy, sortOrder, page: 1 })),
    }),
    [dispatch]
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

  // RETURN ALL PROPERTIES - HOOKS MUST ALWAYS BE CALLED IN SAME ORDER
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

    // Computed values - spread them so component can access directly
    ...computed,

    // Actions - spread them so component can access directly
    ...actions,

    // Quick actions
    ...quickActions,

    // Filter shortcuts
    ...filterShortcuts,

    // Helpers
    ...helpers,
  };
};

// Keep other hooks unchanged but ensure they don't have conditional calls
export const useUserForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.users);

  const createUserHandler = useCallback(
    async (userData: CreateUserData): Promise<any> => {
      try {
        const result = await dispatch(createUser(userData));
        return result.payload;
      } catch (err) {
        throw err;
      }
    },
    [dispatch]
  );

  const updateUserHandler = useCallback(
    async (id: string, updates: UpdateUserData): Promise<any> => {
      try {
        const result = await dispatch(updateUser({ id, updates }));
        return result.payload;
      } catch (err) {
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
