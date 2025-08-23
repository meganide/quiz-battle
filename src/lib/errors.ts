export const UI_ERRORS = {
  SIDEBAR_PROVIDER_REQUIRED: new Error("useSidebar must be used within a SidebarProvider."),
  FORM_FIELD_REQUIRED: new Error("useFormField should be used within <FormField>"),
  CAROUSEL_REQUIRED: new Error("useCarousel must be used within a <Carousel />"),
  CHART_CONTAINER_REQUIRED: new Error("useChart must be used within a <ChartContainer />"),
} as const
