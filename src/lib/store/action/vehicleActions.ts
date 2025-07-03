import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setVehicleFilters,
  resetVehicleFilters,
  selectVehicle,
  deselectVehicle,
  toggleVehicleSelection,
  selectAllVehicles,
  clearVehicleSelection,
  setCurrentVehicle,
  clearCurrentVehicle,
  updateVehicleInState,
  clearVehicleError,
} from "../slices/vehicle.slice";
import { Vehicle } from "../../types/lead.type";
import type { RootState } from "../index";

// ============================================================================
// SELECTORS
// ============================================================================

export const selectVehicles = (state: RootState) => state.vehicles.vehicles;
export const selectCurrentVehicle = (state: RootState) =>
  state.vehicles.currentVehicle;
export const selectVehicleFilters = (state: RootState) =>
  state.vehicles.filters;
export const selectSelectedVehicles = (state: RootState) =>
  state.vehicles.selectedVehicles;
export const selectVehicleLoading = (state: RootState) =>
  state.vehicles.isLoading;
export const selectVehicleError = (state: RootState) => state.vehicles.error;
export const selectVehiclePagination = (state: RootState) =>
  state.vehicles.pagination;

export const selectVehicleById = (id: string) => (state: RootState) =>
  state.vehicles.vehicles.find((vehicle) => vehicle.id === id);

export const selectSelectedVehiclesData = (state: RootState) =>
  state.vehicles.selectedVehicles
    .map((id) => state.vehicles.vehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean);

export const selectHasSelectedVehicles = (state: RootState) =>
  state.vehicles.selectedVehicles.length > 0;

export const selectSelectedVehiclesCount = (state: RootState) =>
  state.vehicles.selectedVehicles.length;

export const selectIsVehicleSelected =
  (vehicleId: string) => (state: RootState) =>
    state.vehicles.selectedVehicles.includes(vehicleId);

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useVehicles = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const vehicles = useAppSelector(selectVehicles);
  const currentVehicle = useAppSelector(selectCurrentVehicle);
  const filters = useAppSelector(selectVehicleFilters);
  const selectedVehicles = useAppSelector(selectSelectedVehicles);
  const isLoading = useAppSelector(selectVehicleLoading);
  const error = useAppSelector(selectVehicleError);
  const pagination = useAppSelector(selectVehiclePagination);

  const actions = {
    fetchVehicles: useCallback(
      async (filters?: any) => {
        const result = await dispatch(fetchVehicles(filters ?? {}));
        if (fetchVehicles.fulfilled.match(result)) {
          return result.payload;
        } else if (fetchVehicles.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      },
      [dispatch]
    ),
    createVehicle: useCallback(
      async (vehicleData: Partial<Vehicle>) => {
        const result = await dispatch(createVehicle(vehicleData));
        if (createVehicle.fulfilled.match(result)) {
          await dispatch(fetchVehicles(filters));
          return result.payload;
        } else if (createVehicle.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      },
      [dispatch, filters]
    ),
    updateVehicle: useCallback(
      async (id: string, updates: Partial<Vehicle>) => {
        const result = await dispatch(updateVehicle({ id, updates }));
        if (updateVehicle.fulfilled.match(result)) {
          return result.payload;
        } else if (updateVehicle.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      },
      [dispatch]
    ),
    deleteVehicle: useCallback(
      async (id: string) => {
        const result = await dispatch(deleteVehicle(id));
        if (deleteVehicle.fulfilled.match(result)) {
          return result.payload;
        } else if (deleteVehicle.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      },
      [dispatch]
    ),
    setFilters: useCallback(
      (newFilters: any) => {
        dispatch(setVehicleFilters(newFilters));
        setTimeout(() => {
          dispatch(fetchVehicles({ ...filters, ...newFilters }));
        }, 100);
      },
      [dispatch, filters]
    ),
    resetFilters: useCallback(() => {
      dispatch(resetVehicleFilters());
      setTimeout(() => {
        dispatch(fetchVehicles({}));
      }, 100);
    }, [dispatch]),
    selectVehicle: useCallback(
      (id: string) => dispatch(selectVehicle(id)),
      [dispatch]
    ),
    deselectVehicle: useCallback(
      (id: string) => dispatch(deselectVehicle(id)),
      [dispatch]
    ),
    toggleSelection: useCallback(
      (id: string) => dispatch(toggleVehicleSelection(id)),
      [dispatch]
    ),
    selectAll: useCallback(() => dispatch(selectAllVehicles()), [dispatch]),
    clearSelection: useCallback(
      () => dispatch(clearVehicleSelection()),
      [dispatch]
    ),
    setCurrentVehicle: useCallback(
      (vehicle: Vehicle | null) => dispatch(setCurrentVehicle(vehicle)),
      [dispatch]
    ),
    clearCurrentVehicle: useCallback(
      () => dispatch(clearCurrentVehicle()),
      [dispatch]
    ),
    updateVehicleInState: useCallback(
      (id: string, updates: Partial<Vehicle>) =>
        dispatch(updateVehicleInState({ id, updates })),
      [dispatch]
    ),
    clearError: useCallback(() => dispatch(clearVehicleError()), [dispatch]),
    refetch: useCallback(
      (customFilters?: any) =>
        dispatch(fetchVehicles(customFilters || filters)),
      [dispatch, filters]
    ),
  };

  const helpers = {
    isSelected: useCallback(
      (vehicleId: string) => selectedVehicles.includes(vehicleId),
      [selectedVehicles]
    ),
    getVehicleById: useCallback(
      (id: string) => vehicles.find((vehicle) => vehicle.id === id),
      [vehicles]
    ),
    getSelectedVehiclesData: useCallback(
      () =>
        selectedVehicles
          .map((id) => vehicles.find((vehicle) => vehicle.id === id))
          .filter(Boolean),
      [selectedVehicles, vehicles]
    ),
    hasSelectedVehicles: selectedVehicles.length > 0,
    selectedCount: selectedVehicles.length,
    isError: !!error,
    isEmpty: !isLoading && vehicles.length === 0,
    hasVehicles: vehicles.length > 0,
  };

  return {
    vehicles,
    currentVehicle,
    filters,
    selectedVehicles,
    isLoading,
    error,
    pagination,
    ...actions,
    ...helpers,
  };
};
