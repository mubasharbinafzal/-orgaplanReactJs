const BASE_URL = process.env.REACT_APP_SERVER_URL;
const BASE_URL_V1 = BASE_URL + "api/v1/";

const endpoints = {
  // ================================ GENERAL ================================
  BASE_URL,
  BASE_URL_V1,
  FILE_SIZE: 10485760,
  FILE_UPLOAD: BASE_URL_V1 + "file-upload",

  // ================================ AUTH ================================
  USER_GET: BASE_URL_V1 + "auth/get",
  LOGIN: BASE_URL_V1 + "auth/sign-in",
  REGISTER_USER: BASE_URL_V1 + "auth/sign-up",
  RESET_PASSWORD: BASE_URL_V1 + "auth/reset-password",
  VALIDATE_TOKEN: BASE_URL_V1 + "auth/validate-token",
  GET_PROFILE: BASE_URL_V1 + "auth/get-profile-by-jwt",
  UPDATE_PASSWORD: BASE_URL_V1 + "auth/update-password",
  REQUEST_PASSWORD_RESET: BASE_URL_V1 + "auth/request-password-reset",
  RESEND_EMAIL_VERIFICATION: BASE_URL_V1 + "auth/request-email-verification",

  // ================================ SUPERADMIN ================================
  // ADMIN
  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ADMIN_GET: BASE_URL_V1 + "superadmin/admins/get",
  ADMIN_DELETE: BASE_URL_V1 + "superadmin/admins/delete",
  ADMIN_REGISTRATION: BASE_URL_V1 + "superadmin/admins/complete-registeration",
  // BUILDING
  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  BUILDINGS_BY_SITE: BASE_URL_V1 + "superadmin/buildings/site",
  // COMPANY
  COMPANY: BASE_URL_V1 + "superadmin/companies",
  COMPANY_GET: BASE_URL_V1 + "superadmin/companies/get",
  // CLIENT
  CLIENTS: BASE_URL_V1 + "superadmin/clients",
  CLIENT_DELETE: BASE_URL_V1 + "superadmin/clients/delete",
  // DASHBOARD
  DASHBOARD: BASE_URL_V1 + "superadmin/dashboard",
  // INVOICE
  INVOICE: BASE_URL_V1 + "superadmin/invoices/get",
  INVOICES: BASE_URL_V1 + "superadmin/invoices",
  INVOICES_BY_CLIENT: BASE_URL_V1 + "superadmin/invoices/client",
  INVOICE_DELETE: BASE_URL_V1 + "superadmin/invoices/delete",
  // LEVEL
  LEVELS: BASE_URL_V1 + "superadmin/levels",
  LEVELS_BUILDING: BASE_URL_V1 + "superadmin/levels/building",
  // QUOTE
  QUOTE: BASE_URL_V1 + "superadmin/quotes",
  QUOTE_VERIFY: BASE_URL_V1 + "superadmin/quotes/verify",
  // SITE
  SITES: BASE_URL_V1 + "superadmin/sites",
  SITE_GET: BASE_URL_V1 + "superadmin/sites/get",
  SITE_DELETE: BASE_URL_V1 + "superadmin/sites/delete",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITES_BY_ADMIN: BASE_URL_V1 + "superadmin/sites/admin",
  SITES_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",
  // ZAC
  ZACS: BASE_URL_V1 + "superadmin/zacs",
  ZAC_DELETE: BASE_URL_V1 + "superadmin/zacs/delete",

  // ================================ ADMIN ================================
  // SITE PIC
  ADMIN_PIC: BASE_URL_V1 + "site-pic",
  ADMIN_PIC_PDF: BASE_URL_V1 + "site-pic/pdf",
  ADMIN_PIC_GET: BASE_URL_V1 + "site-pic/get",
  ADMIN_PIC_SITE: BASE_URL_V1 + "site-pic/site",
  ADMIN_PIC_SHAPE: BASE_URL_V1 + "site-pic/shape",
  ADMIN_PIC_SHAPE_POINTS: BASE_URL_V1 + "site-pic/shape",
  ADMIN_LEVEL_PIC_SHAPE_POINTS: BASE_URL_V1 + "level-pic/shape",


  ADMIN_PIC_BY_SITE: BASE_URL_V1 + "site-pic/site",

  // LEVEL PIC
  ADMIN_LEVEL_PIC: BASE_URL_V1 + "level-pic",
  ADMIN_LEVEL_PIC_GET: BASE_URL_V1 + "level-pic/get",
  ADMIN_LEVEL_PIC_SHAPE: BASE_URL_V1 + "level-pic/shape",
  ADMIN_LEVEL_PIC_BY_LEVEL: BASE_URL_V1 + "level-pic/level",

  // MEANS
  MEAN: BASE_URL_V1 + "mean",
  UPDATE_MEAN: BASE_URL_V1 + "mean",
  GET_MEAN_HISTORY: BASE_URL_V1 + "mean_booking",
  GET_VALIDATED_MEAN: BASE_URL_V1 + "mean_booking/getValidatedMean",
  SITE_MEANS: BASE_URL_V1 + "mean/get_site_means",
  GET_ADD_MEAN: BASE_URL_V1 + "mean/get_add_mean",
  GET_LIST_OF_MEANS: BASE_URL_V1 + "mean/get_list_of_means",
  GET_MEAN_PATH: BASE_URL_V1 + "mean/get_path",


  // STORAGE AREA
  CREATE_STORAGE_AREA: BASE_URL_V1 + "storage-area",
  GET_STORAGE_AREA_MEANS: BASE_URL_V1 + "storage-area/means",
  GET_STORAGE_AREAS_BY_SITE: BASE_URL_V1 + "storage-area/site",
  GET_STORAGE_AREA_BY_SITE_ID: BASE_URL_V1 + "storage-area/get_storage_site",

  // DELIVERY AREA
  CREATE_DELIVERY_AREA: BASE_URL_V1 + "delivery-area",
  GET_DELIVERY_AREA_MEANS: BASE_URL_V1 + "delivery-area/delivery-area-means",
  GET_DELIVERY_AREA_BY_SITE_ID:
    BASE_URL_V1 + "delivery-area/get_delivery_area_site/enterprise",
  getDeliveryAreaSiteBySiteId:
    BASE_URL_V1 + "delivery-area/get_delivery_area_site/enterprise",

  // DELIVERY
  DELIVERY: BASE_URL_V1 + "delivery",
  GET_DELIVERY: BASE_URL_V1 + "delivery/get",
  GET_VALIDATED_DELIVERY_MEAN:
    BASE_URL_V1 + "delivery/getValidatedDeliveryMean",

  SITE_VEHICLES: BASE_URL_V1 + "vehicles/get_site_vehicles",

  FILTER_MEANS: BASE_URL_V1 + "mean/filter",
  GET_USER_SITES: BASE_URL_V1 + "user-sites/user",

  ADMIN_COMPANY: BASE_URL_V1 + "company",
  GET_COMPANY_USER: BASE_URL_V1 + "company/user",
  GET_ADMIN_COMPANY: BASE_URL_V1 + "company/admin",
  ADMIN_SITE_COMPANY: BASE_URL_V1 + "company/site",
  GET_COMPANY_USERS: BASE_URL_V1 + "company/users",
  ADMIN_SITE_COMPANY_FILTER: BASE_URL_V1 + "company/filter",
  ADMIN_COMPANY_EXCLUDE_SITE: BASE_URL_V1 + "company/site-exclude",
  ADDCOMPANYDATA: BASE_URL_V1 + "company/add_companiesData",

  GET_ALL_USERS: BASE_URL_V1 + "users",
  UPDATE_USER: BASE_URL_V1 + "users/update",
  FILTER_USER: BASE_URL_V1 + "users/filter",
  GET_ADD_USER: BASE_URL_V1 + "users/add_user",
  ADD_USER_ADMIN: BASE_URL_V1 + "users/admin/add_user",
  GET_USER_COMPANY: BASE_URL_V1 + "users/get_user_company",
  ADD_COMPANY_USER: BASE_URL_V1 + "users/add_company_user",
  UPDATE_COMPANY_USER: BASE_URL_V1 + "users/update_company_user",

  POST_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme",
  GET_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/site",
  PUT_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/update",
  DELETE_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/delete",

  GET_SITE_STORAGE_AREA: BASE_URL_V1 + "storage-area-request",
  ACCEPT_SITE_STORAGE_AREA: BASE_URL_V1 + "storage-area-request/accept",
  REJECT_SITE_STORAGE_AREA: BASE_URL_V1 + "storage-area-request/reject",

  GET_ALL_SITE_INCIDENT: BASE_URL_V1 + "incidents",
  FILTER_INCIDENT: BASE_URL_V1 + "incidents/filter",
  POST_ADD_SITE_INCIDENTS: BASE_URL_V1 + "incidents",
  GET_SITE_INCIDENT: BASE_URL_V1 + "incidents/admin",
  GET_ALL_SITE_INCIDENTS: BASE_URL_V1 + "incidents/admin/incident_list",

  CREATE_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  Update_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  GET_ALL_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  Update_BOOKING_MEAN_STATUS: BASE_URL_V1 + "mean_booking/updateStatus",
  Delete_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  FILTER_BOOKING: BASE_URL_V1 + "mean_booking/filter",
  UPDATE_MEAN_STATUS: BASE_URL_V1 + "mean_booking/updateStatus",
  BOOKINGS_BY_SITE: BASE_URL_V1 + "mean_booking/getBookingBySiteId",
  filterBookingCalendar: BASE_URL_V1 + "mean_booking/filter_Booking_calendar",
  updateDeliveryStatus: BASE_URL_V1 + "delivery/updateStatus",
  getBuildingsBySiteId: BASE_URL_V1 + "building/get_by_site_id",
  HistoryOfPlan: BASE_URL_V1 + "building/history",
  GetHistoryOfPlans: BASE_URL_V1 + "building/getHistory",

  delete_Delivery: BASE_URL_V1 + "delivery",
  getDeliveryallStorageArea: BASE_URL_V1 + "delivery/getDeliveryAllStroageArea",
};
export default endpoints;
