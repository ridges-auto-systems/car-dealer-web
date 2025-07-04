import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchUsers,
  fetchUser,
  fetchSalesReps,
  fetchUserStats,
  setFilters,
  resetFilters,
  selectUser,
  deselectUser,
  toggleUserSelection,
  selectAllUsers,
  clearSelection,
  setCurrentUser,
  clearCurrentUser,
  updateUserInState,
  clearError,
} from "../slices/user.slice";
import type { UserFilters, User } from "@/lib/types/user.type";
import type { RootState } from "../index";

// ============================================================================
// SELECTORS
// ============================================================================

export const selectUsers = (state: RootState) => state.users.users;
export const selectSelectedUsers = (state: RootState) =>
  state.users.selectedUsers;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUserLoading = (state: RootState) => state.users.isLoading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectUserPagination = (state: RootState) =>
  state.users.pagination;
export const selectUserFilters = (state: RootState) => state.users.filters;

export const useUsers = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const users = useAppSelector(selectUsers);
  const selectedUsers = useAppSelector(selectSelectedUsers);
  const filters = useAppSelector(selectUserFilters);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const pagination = useAppSelector(selectUserPagination);

  const actions = {
    // 🔥 FIXED: Changed from fetchLeads to fetchUsers
    fetchUsers: useCallback(
      async (filters?: UserFilters) => {
        try {
          console.log(
            "🔄 useUsers: Dispatching fetchUsers with filters:",
            filters
          );
          const result = await dispatch(fetchUsers(filters ?? {}));

          if (fetchUsers.fulfilled.match(result)) {
            console.log("✅ useUsers: fetchUsers succeeded");
            return result.payload;
          } else if (fetchUsers.rejected.match(result)) {
            console.error("❌ useUsers: fetchUsers failed:", result.payload);
            throw new Error(result.payload as string);
          }
        } catch (error) {
          console.error("❌ useUsers: fetchUsers error:", error);
          throw error;
        }
      },
      [dispatch]
    ),

    setFilters: useCallback(
      (newFilters: Partial<UserFilters>) => {
        console.log("🔧 useUsers: Setting filters:", newFilters);
        dispatch(setFilters(newFilters));
        // Auto-refresh with new filters
        setTimeout(() => {
          dispatch(fetchUsers({ ...filters, ...newFilters }));
        }, 100);
      },
      [dispatch, filters]
    ),

    resetFilters: useCallback(() => {
      console.log("🔧 useUsers: Resetting filters");
      dispatch(resetFilters());
      // Auto-refresh with default filters
      setTimeout(() => {
        dispatch(fetchUsers({}));
      }, 100);
    }, [dispatch]),

    selectUser: useCallback(
      (id: string) => dispatch(selectUser(id)),
      [dispatch]
    ),

    // 🔥 FIXED: Changed from deselectLead to deselectUser
    deselectUser: useCallback(
      (id: string) => dispatch(deselectUser(id)),
      [dispatch]
    ),

    toggleSelection: useCallback(
      (id: string) => dispatch(toggleUserSelection(id)),
      [dispatch]
    ),

    selectAll: useCallback(() => dispatch(selectAllUsers()), [dispatch]),

    clearSelection: useCallback(() => dispatch(clearSelection()), [dispatch]),

    // 🔥 FIXED: Changed from setCurrentLead to setCurrentUser
    setCurrentUser: useCallback(
      (user: User | null) => dispatch(setCurrentUser(user)),
      [dispatch]
    ),

    clearCurrentUser: useCallback(
      () => dispatch(clearCurrentUser()),
      [dispatch]
    ),

    clearError: useCallback(() => dispatch(clearError()), [dispatch]),

    // Convenience methods
    refetch: useCallback(
      (customFilters?: UserFilters) => {
        console.log("🔄 useUsers: Manual refetch requested");
        return dispatch(fetchUsers(customFilters ?? filters));
      },
      [dispatch, filters]
    ),
  };

  // Helper functions
  const helpers = {
    isSelected: useCallback(
      (userId: string) => selectedUsers.includes(userId),
      [selectedUsers]
    ),

    // 🔥 FIXED: Changed from getLeadById to getUserById
    getUserById: useCallback(
      (id: string) => users.find((user) => user.id === id),
      [users]
    ),

    // 🔥 FIXED: Changed from getSelectedLeadsData to getSelectedUsersData
    getSelectedUsersData: useCallback(
      () =>
        selectedUsers
          .map((id: any) => users.find((user) => user.id === id))
          .filter(Boolean),
      [selectedUsers, users]
    ),

    // 🔥 FIXED: Changed from hasSelectedLeads to hasSelectedUsers
    hasSelectedUsers: selectedUsers.length > 0,
    selectedCount: selectedUsers.length,

    // Add loading and error states to helpers
    isError: !!error,
    isEmpty: !isLoading && users.length === 0,
    hasUsers: users.length > 0,
  };

  return {
    // State
    users,
    filters,
    selectedUsers,
    isLoading,
    error,
    pagination,

    // Actions
    ...actions,

    // Helpers
    ...helpers,
  };
};

export const useUserFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectUserFilters);

  const updateFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
};
