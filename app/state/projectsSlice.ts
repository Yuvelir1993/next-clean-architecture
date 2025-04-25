import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProjectUiDTO } from "@/src/adapters/dto/aggregates/project.dto";
import { ProjectsState, CreateProjectFormErrors } from "@/app/lib/definitions";
import {
  createProjectAction,
  getProjectsAction,
  deleteProjectAction,
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
  const result = await createProjectAction(formData);

  if (!result) {
    return rejectWithValue({
      description: ["An unknown error occurred."],
    });
  }

  if (result.errors) {
    return rejectWithValue(result.errors);
  }

  if (result.project) {
    return result.project;
  }

  return rejectWithValue({
    description: ["Unexpected response shape."],
  });
});

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("projects/deleteProject", async (projectId, { rejectWithValue }) => {
  try {
    await deleteProjectAction(projectId);
    return projectId;
  } catch {
    return rejectWithValue("Failed to delete project");
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ─── getProjects ──────────────────────────────────────────
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

      // ─── createProject ────────────────────────────────────────
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
      })

      // ─── deleteProject ────────────────────────────────────────
      .addCase(deleteProject.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.loading = false;
        // filter out the deleted project by its ID
        // console.log
        s.projects = s.projects.filter((p) => p.id !== a.payload);
      })
      .addCase(deleteProject.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? a.error.message ?? "Failed to delete project";
      });
  },
});

export default projectsSlice.reducer;
