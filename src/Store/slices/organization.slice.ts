import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiOrganization, OrganizationType, CreateOrganizationRequest } from '../../Api';

interface OrganizationState {
  organizations: OrganizationType[];
  currentOrganization: OrganizationType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserOrganizations = createAsyncThunk(
  'organization/fetchUserOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.GetUserOrganizations();
      return response.data || [];
    } catch (error: any) {
      console.log(error.status)
      return rejectWithValue(error.message || 'Failed to fetch user organizations');
    }
  }
);

export const fetchAllOrganizations = createAsyncThunk(
  'organization/fetchAllOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.GetAll();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch organizations');
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async (data: CreateOrganizationRequest, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.Create(data);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create organization');
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  'organization/fetchOrganizationById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.GetById(id);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch organization');
    }
  }
);

export const updateOrganization = createAsyncThunk(
  'organization/updateOrganization',
  async ({ id, data }: { id: number; data: Partial<CreateOrganizationRequest> }, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.Update(id, data);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update organization');
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organization/deleteOrganization',
  async (id: number, { rejectWithValue }) => {
    try {
      await ApiOrganization.Delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete organization');
    }
  }
);

export const addMemberToOrganization = createAsyncThunk(
  'organization/addMember',
  async ({ organizationId, userId }: { organizationId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.AddMember(organizationId, userId);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add member');
    }
  }
);

export const removeMemberFromOrganization = createAsyncThunk(
  'organization/removeMember',
  async ({ organizationId, userId }: { organizationId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await ApiOrganization.RemoveMember(organizationId, userId);
      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove member');
    }
  }
);

// Organization slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrganization: (state, action: PayloadAction<OrganizationType | null>) => {
      state.currentOrganization = action.payload;
    },
    clearOrganizations: (state) => {
      state.organizations = [];
      state.currentOrganization = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user organizations
    builder
      .addCase(fetchUserOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Fetch all organizations
    builder
      .addCase(fetchAllOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create organization
    builder
      .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations.unshift(action.payload); // Add to beginning
        state.error = null;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Fetch organization by id
    builder
      .addCase(fetchOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrganization = action.payload;
        state.error = null;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update organization
    builder
      .addCase(updateOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Delete organization
    builder
      .addCase(deleteOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = state.organizations.filter(org => org.id !== action.payload);
        if (state.currentOrganization?.id === action.payload) {
          state.currentOrganization = null;
        }
        state.error = null;
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Add member
    builder
      .addCase(addMemberToOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
      })

    // Remove member
    builder
      .addCase(removeMemberFromOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentOrganization, clearOrganizations } = organizationSlice.actions;
export default organizationSlice.reducer;