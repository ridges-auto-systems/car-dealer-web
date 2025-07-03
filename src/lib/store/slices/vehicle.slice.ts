import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle } from "../../types/vehicle.type";

export interface VehicleFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export interface VehicleState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  filters: VehicleFilters;
  selectedVehicles: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  selectedVehicles: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (filters: VehicleFilters = {}, { rejectWithValue }) => {
    try {
      const API_BASE_URL = "http://localhost:5000/api";
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      const url = `${API_BASE_URL}/vehicles${
        params.toString() ? "?" + params.toString() : ""
      }`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      if (data && data.success && data.data) {
        return {
          vehicles: data.data.vehicles || [],
          pagination: data.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        };
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch vehicles");
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (vehicleData: Partial<Vehicle>, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      if (!response.ok)
        throw new Error(`Failed to create vehicle: ${response.status}`);
      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create vehicle");
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    { id, updates }: { id: string; updates: Partial<Vehicle> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok)
        throw new Error(`Failed to update vehicle: ${response.status}`);
      const result = await response.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update vehicle");
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`Failed to delete vehicle: ${response.status}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete vehicle");
    }
  }
);

// Slice
const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicleFilters: (
      state,
      action: PayloadAction<Partial<VehicleFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetVehicleFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    selectVehicle: (state, action: PayloadAction<string>) => {
      const vehicleId = action.payload;
      if (!state.selectedVehicles.includes(vehicleId)) {
        state.selectedVehicles.push(vehicleId);
      }
    },
    deselectVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicles = state.selectedVehicles.filter(
        (id) => id !== action.payload
      );
    },
    toggleVehicleSelection: (state, action: PayloadAction<string>) => {
      const vehicleId = action.payload;
      if (state.selectedVehicles.includes(vehicleId)) {
        state.selectedVehicles = state.selectedVehicles.filter(
          (id) => id !== vehicleId
        );
      } else {
        state.selectedVehicles.push(vehicleId);
      }
    },
    selectAllVehicles: (state) => {
      state.selectedVehicles = state.vehicles.map((vehicle) => vehicle.id);
    },
    clearVehicleSelection: (state) => {
      state.selectedVehicles = [];
    },
    setCurrentVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.currentVehicle = action.payload;
    },
    clearCurrentVehicle: (state) => {
      state.currentVehicle = null;
    },
    updateVehicleInState: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Vehicle> }>
    ) => {
      const { id, updates } = action.payload;
      const idx = state.vehicles.findIndex((v) => v.id === id);
      if (idx !== -1) {
        state.vehicles[idx] = { ...state.vehicles[idx], ...updates };
      }
      if (state.currentVehicle?.id === id) {
        state.currentVehicle = { ...state.currentVehicle, ...updates };
      }
    },
    clearVehicleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (
          action.payload &&
          action.payload.vehicles &&
          Array.isArray(action.payload.vehicles)
        ) {
          state.vehicles = action.payload.vehicles;
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        } else {
          state.vehicles = [];
          state.error = "Invalid data format received from API";
        }
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch vehicles";
        state.vehicles = [];
      })
      .addCase(createVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.payload.success &&
          action.payload.data &&
          action.payload.data.vehicle
        ) {
          const newVehicle = action.payload.data.vehicle;
          state.vehicles.unshift(newVehicle);
        }
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create vehicle";
      })
      .addCase(updateVehicle.pending, (state) => {
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const updatedVehicle = action.payload.data;
          const idx = state.vehicles.findIndex(
            (v) => v.id === updatedVehicle.id
          );
          if (idx !== -1) {
            state.vehicles[idx] = updatedVehicle;
          }
          if (state.currentVehicle?.id === updatedVehicle.id) {
            state.currentVehicle = updatedVehicle;
          }
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update vehicle";
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        const vehicleId = action.payload;
        state.vehicles = state.vehicles.filter((v) => v.id !== vehicleId);
        state.selectedVehicles = state.selectedVehicles.filter(
          (id) => id !== vehicleId
        );
        if (state.currentVehicle?.id === vehicleId) {
          state.currentVehicle = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete vehicle";
      });
  },
});

export const {
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
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
