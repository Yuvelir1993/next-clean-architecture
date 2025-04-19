import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProjectUiDTO } from "@/src/adapters/dto/aggregates/project.dto";
import { ProjectsState, CreateProjectFormErrors } from "@/app/lib/definitions";
import {
  createProjectAction,
  getProjectsAction,
} from "@/app/dashboard/actions";

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const getProjects = createAsyncThunk<
  ProjectUiDTO[],
  void,
  { rejectValue: string }
>("projects/getProjects", async (_, thunkAPI) => {
  try {
    const projects = await getProjectsAction();
    return projects;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      `Failed to fetch projects. Error: ${error}`
    );
  }
});

export const createProject = createAsyncThunk<
  ProjectUiDTO,
  FormData,
  { rejectValue: CreateProjectFormErrors }
>("projects/createProject", async (formData, { rejectWithValue }) => {
  // Call your existing helper
  const result = await createProjectAction(formData);

  // 1) If it returned `undefined` = unexpected
  if (!result) {
    return rejectWithValue({
      description: ["An unknown error occurred."],
    });
  }

  // 2) If it returned validation errors
  if (result.errors) {
    return rejectWithValue(result.errors);
  }

  // 3) Otherwise, it must have `project`
  if (result.project) {
    return result.project;
  }

  // 4) Fallback, shouldn’t happen
  return rejectWithValue({
    description: ["Unexpected response shape."],
  });
});
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /**
       * Get projects cases
       */
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to fetch projects";
        state.loading = false;
      })
      /**
       * Create project cases
       */
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to create project";
      });
  },
});

export default projectsSlice.reducer;
