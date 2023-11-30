import { ProjectSettings } from "shared/types/ProjectSettings";
import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";

type GetProjectSettingsAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<ProjectSettings>>;

export { type GetProjectSettingsAction };
