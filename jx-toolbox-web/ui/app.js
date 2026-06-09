const LOCAL_DEEPSEEK_ENDPOINT = "/api/v2/deepseek";
const API_BASE = "/api/v2";
const DEEPSEEK_ANALYSIS_TOOL_KEY = "deepseek-analysis";
const PDF_PROCESSING_TOOL_KEY = "pdf-processing";
const IMAGE_PROCESSING_TOOL_KEY = "image-processing";

if (location.protocol === "file:") {
  location.href = "http://127.0.0.1:5173/";
}

let profileMeta = {
  self: { name: "本人", fileName: "self" },
};

const sampleRecords = [
  { date: "2026-04-07", weight: 72.4, note: "晚饭后散步 35 分钟" },
  { date: "2026-04-12", weight: 72.0, note: "早起空腹测量" },
  { date: "2026-04-18", weight: 71.8, note: "力量训练后恢复日" },
  { date: "2026-04-24", weight: 71.2, note: "晚餐减少主食" },
  { date: "2026-05-01", weight: 70.9, note: "睡眠 7 小时" },
  { date: "2026-05-07", weight: 70.6, note: "跑步 4 公里" },
  { date: "2026-05-14", weight: 70.3, note: "饮水正常" },
  { date: "2026-05-21", weight: 70.1, note: "早起空腹测量" },
];

const sampleWifeRecords = [
  { date: "2026-04-08", weight: 56.8, note: "早起空腹测量" },
  { date: "2026-04-15", weight: 56.5, note: "瑜伽后记录" },
  { date: "2026-04-23", weight: 56.1, note: "晚餐清淡" },
  { date: "2026-05-02", weight: 55.9, note: "步行 6000 步" },
  { date: "2026-05-10", weight: 55.7, note: "睡眠正常" },
  { date: "2026-05-21", weight: 55.5, note: "早起空腹测量" },
];

let profiles = defaultProfiles();
let activeProfile = "self";
let activeRange = "30";
let currentUser = null;

const dateInput = document.querySelector("#dateInput");
const weightInput = document.querySelector("#weightInput");
const targetInput = document.querySelector("#targetInput");
const heightInput = document.querySelector("#heightInput");
const genderInput = document.querySelector("#genderInput");
const noteInput = document.querySelector("#noteInput");
const entryForm = document.querySelector("#entryForm");
const recordsBody = document.querySelector("#recordsBody");
const trendChart = document.querySelector("#trendChart");
const refreshChartButton = document.querySelector("#refreshChartButton");
const rangeButtons = document.querySelectorAll("[data-range]");
const profileButtons = document.querySelectorAll("[data-profile]");
const analyzeButton = document.querySelector("#analyzeButton");
const aiOutput = document.querySelector("#aiOutput");
const analysisContextInput = document.querySelector("#analysisContextInput");
const deepSeekUsageLabel = document.querySelector("#deepSeekUsageLabel");
const saveProfileButton = document.querySelector("#saveProfileButton");
const profileSummaryLabel = document.querySelector("#profileSummaryLabel");
const authShell = document.querySelector("#authShell");
const appShell = document.querySelector("#appShell");
const authForm = document.querySelector("#authForm");
const authTabs = document.querySelectorAll("[data-auth-mode]");
const usernameInput = document.querySelector("#usernameInput");
const displayNameInput = document.querySelector("#displayNameInput");
const displayNameLabel = document.querySelector("#displayNameLabel");
const passwordInput = document.querySelector("#passwordInput");
const confirmPasswordInput = document.querySelector("#confirmPasswordInput");
const confirmPasswordLabel = document.querySelector("#confirmPasswordLabel");
const authSubmitButton = document.querySelector("#authSubmitButton");
const authMessage = document.querySelector("#authMessage");
const forgotPasswordLink = document.querySelector("#forgotPasswordLink");
const changePasswordButton = document.querySelector("#changePasswordButton");
const logoutButton = document.querySelector("#logoutButton");
const appEyebrow = document.querySelector("#appEyebrow");
const appTitle = document.querySelector("#appTitle");
const toolHome = document.querySelector("#toolHome");
const adminToolCard = document.querySelector("#adminToolCard");
const backToToolsButton = document.querySelector("#backToToolsButton");
const adminView = document.querySelector("#adminView");
const passwordPanel = document.querySelector("#passwordPanel");
const dashboardPage = document.querySelector("#dashboardPage");
const pageButtons = document.querySelectorAll("[data-page]");
const navButtons = document.querySelectorAll(".menu-btn[data-page]");
const adminNavItems = document.querySelectorAll(".admin-nav");
const sidebarLogoutButton = document.querySelector("#sidebarLogoutButton");
const sidebarRoleLabel = document.querySelector("#sidebarRoleLabel");
const topbarAvatar = document.querySelector("#topbarAvatar");
const imageFileNameLabel = document.querySelector("#imageFileNameLabel");
const imagePreviewPlaceholder = document.querySelector("#imagePreviewPlaceholder");
const imageUndoButton = document.querySelector("#imageUndoButton");
const imageRedoButton = document.querySelector("#imageRedoButton");
const imageQualityValue = document.querySelector("#imageQualityValue");
const imageBrightnessValue = document.querySelector("#imageBrightnessValue");
const imageContrastValue = document.querySelector("#imageContrastValue");
const globalSearchInput = document.querySelector("#globalSearchInput");
const passwordForm = document.querySelector("#passwordForm");
const oldPasswordInput = document.querySelector("#oldPasswordInput");
const newPasswordInput = document.querySelector("#newPasswordInput");
const repeatNewPasswordInput = document.querySelector("#repeatNewPasswordInput");
const passwordMessage = document.querySelector("#passwordMessage");
const cancelPasswordButton = document.querySelector("#cancelPasswordButton");
const accountForm = document.querySelector("#accountForm");
const accountIdInput = document.querySelector("#accountIdInput");
const accountUsernameInput = document.querySelector("#accountUsernameInput");
const accountDisplayNameInput = document.querySelector("#accountDisplayNameInput");
const accountPasswordInput = document.querySelector("#accountPasswordInput");
const accountRoleInput = document.querySelector("#accountRoleInput");
const accountSubmitButton = document.querySelector("#accountSubmitButton");
const cancelAccountEditButton = document.querySelector("#cancelAccountEditButton");
const accountMessage = document.querySelector("#accountMessage");
const accountFormMessage = document.querySelector("#accountFormMessage");
const accountsBody = document.querySelector("#accountsBody");
const accountModal = document.querySelector("#accountModal");
const accountModalTitle = document.querySelector("#accountModalTitle");
const accountModalSubtitle = document.querySelector("#accountModalSubtitle");
const openAccountModalButton = document.querySelector("#openAccountModalButton");
const toolButtons = document.querySelectorAll("[data-tool]");
const toolViews = document.querySelectorAll(".tool-view");
const toolCategoryList = document.querySelector("#toolCategoryList");
const toolGrid = document.querySelector("#toolGrid");
const toolSideDetail = document.querySelector("#toolSideDetail");
const toolSearchInput = document.querySelector("#toolSearchInput");
const toolStatusFilter = document.querySelector("#toolStatusFilter");
const toolSortFilter = document.querySelector("#toolSortFilter");
const resetToolFiltersButton = document.querySelector("#resetToolFiltersButton");
const currentCategoryName = document.querySelector("#currentCategoryName");
const visibleToolCount = document.querySelector("#visibleToolCount");
const enabledToolCount = document.querySelector("#enabledToolCount");
const toolRoleSummary = document.querySelector("#toolRoleSummary");
const dashboardToolCount = document.querySelector("#dashboardToolCount");
const dashboardCategoryCount = document.querySelector("#dashboardCategoryCount");
const dashboardRoleValue = document.querySelector("#dashboardRoleValue");
const toggleHistoryButton = document.querySelector("#toggleHistoryButton");
const historyTableWrap = document.querySelector("#historyTableWrap");
const watermarkForm = document.querySelector("#watermarkForm");
const watermarkImageInput = document.querySelector("#watermarkImageInput");
const watermarkTextInput = document.querySelector("#watermarkTextInput");
const watermarkFontInput = document.querySelector("#watermarkFontInput");
const watermarkSizeInput = document.querySelector("#watermarkSizeInput");
const watermarkColorInput = document.querySelector("#watermarkColorInput");
const watermarkOpacityInput = document.querySelector("#watermarkOpacityInput");
const watermarkAngleInput = document.querySelector("#watermarkAngleInput");
const watermarkGapXInput = document.querySelector("#watermarkGapXInput");
const watermarkGapYInput = document.querySelector("#watermarkGapYInput");
const watermarkModeInput = document.querySelector("#watermarkModeInput");
const saveWatermarkSettingsButton = document.querySelector("#saveWatermarkSettingsButton");
const downloadWatermarkButton = document.querySelector("#downloadWatermarkButton");
const watermarkCanvas = document.querySelector("#watermarkCanvas");
const watermarkPdfPreview = document.querySelector("#watermarkPdfPreview");
const watermarkStatus = document.querySelector("#watermarkStatus");
const pdfRedactionPageInput = document.querySelector("#pdfRedactionPageInput");
const pdfRedactionTypeInput = document.querySelector("#pdfRedactionTypeInput");
const pdfRedactionColorInput = document.querySelector("#pdfRedactionColorInput");
const pdfRedactionColorField = document.querySelector("#pdfRedactionColorField");
const pdfRedactionOpacityInput = document.querySelector("#pdfRedactionOpacityInput");
const pdfRedactionOpacityValue = document.querySelector("#pdfRedactionOpacityValue");
const pdfRedactionOpacityField = document.querySelector("#pdfRedactionOpacityField");
const pdfRedactionBlockField = document.querySelector("#pdfRedactionBlockField");
const pdfRedactionBlockSizeInput = document.querySelector("#pdfRedactionBlockSizeInput");
const pdfRedactionBlockValue = document.querySelector("#pdfRedactionBlockValue");
const undoPdfRedactionButton = document.querySelector("#undoPdfRedactionButton");
const clearPdfRedactionsButton = document.querySelector("#clearPdfRedactionsButton");
const pdfPageNav = document.querySelector("#pdfPageNav");
const pdfPageNavLabel = document.querySelector("#pdfPageNavLabel");
const pdfPrevPageButton = document.querySelector("#pdfPrevPageButton");
const pdfNextPageButton = document.querySelector("#pdfNextPageButton");
const pdfZoomNav = document.querySelector("#pdfZoomNav");
const pdfZoomOutButton = document.querySelector("#pdfZoomOutButton");
const pdfZoomInButton = document.querySelector("#pdfZoomInButton");
const pdfZoomFitButton = document.querySelector("#pdfZoomFitButton");
const pdfZoomLabel = document.querySelector("#pdfZoomLabel");
const pdfPreviewCanvasWrap = document.querySelector("#pdfTool .pdf-preview-canvas-wrap");
const pdfSinglePreviewWrap = document.querySelector("#pdfSinglePreviewWrap");
const pdfRedactionCount = document.querySelector("#pdfRedactionCount");
const pdfRedactionList = document.querySelector("#pdfRedactionList");
const pdfFileNameLabel = document.querySelector("#pdfFileNameLabel");
const pdfPreviewPlaceholder = document.querySelector("#pdfPreviewPlaceholder");
const pdfPageCountLabel = document.querySelector("#pdfPageCountLabel");
const pdfRedactionSummaryLabel = document.querySelector("#pdfRedactionSummaryLabel");
const watermarkOpacityValue = document.querySelector("#watermarkOpacityValue");
const refreshPdfPreviewButton = document.querySelector("#refreshPdfPreviewButton");
const pdfToolOptionButtons = document.querySelectorAll("#pdfTool [data-pdf-tool]");
const pdfEditorParams = document.querySelector("#pdfEditorParams");
const pdfParamsSubtitle = document.querySelector("#pdfParamsSubtitle");
const imageMosaicForm = document.querySelector("#imageMosaicForm");
const imageMosaicInput = document.querySelector("#imageMosaicInput");
const imageWatermarkTextInput = document.querySelector("#imageWatermarkTextInput");
const imageWatermarkModeInput = document.querySelector("#imageWatermarkModeInput");
const imageWatermarkSizeInput = document.querySelector("#imageWatermarkSizeInput");
const imageWatermarkColorInput = document.querySelector("#imageWatermarkColorInput");
const imageWatermarkOpacityInput = document.querySelector("#imageWatermarkOpacityInput");
const imageWatermarkAngleInput = document.querySelector("#imageWatermarkAngleInput");
const imageToolOptionButtons = document.querySelectorAll("[data-image-tool]");
const imageProcessingBlocks = document.querySelectorAll("[data-image-panel]");
const imageCropAspectInput = document.querySelector("#imageCropAspectInput");
const clearImageCropButton = document.querySelector("#clearImageCropButton");
const imageResizeWidthInput = document.querySelector("#imageResizeWidthInput");
const imageResizeHeightInput = document.querySelector("#imageResizeHeightInput");
const imageKeepRatioInput = document.querySelector("#imageKeepRatioInput");
const imageQualityInput = document.querySelector("#imageQualityInput");
const imageBackgroundColorInput = document.querySelector("#imageBackgroundColorInput");
const imageGrayscaleInput = document.querySelector("#imageGrayscaleInput");
const imageBrightnessInput = document.querySelector("#imageBrightnessInput");
const imageContrastInput = document.querySelector("#imageContrastInput");
const imageSaturationInput = document.querySelector("#imageSaturationInput");
const imageRotationInput = document.querySelector("#imageRotationInput");
const imageFlipHorizontalInput = document.querySelector("#imageFlipHorizontalInput");
const imageFlipVerticalInput = document.querySelector("#imageFlipVerticalInput");
const imageMosaicBlockInput = document.querySelector("#imageMosaicBlockInput");
const imageMosaicFormatInput = document.querySelector("#imageMosaicFormatInput");
const imageFormatQualityInput = document.querySelector("#imageFormatQualityInput");
const imageFormatBackgroundInput = document.querySelector("#imageFormatBackgroundInput");
const imageFormatQualityValue = document.querySelector("#imageFormatQualityValue");
const imageFormatQualityField = document.querySelector("#imageFormatQualityField");
const imageFormatBackgroundField = document.querySelector("#imageFormatBackgroundField");
const imageFormatRasterHint = document.querySelector("#imageFormatRasterHint");
const imageFormatPdfHint = document.querySelector("#imageFormatPdfHint");
const imageCompressOriginalSizeLabel = document.querySelector("#imageCompressOriginalSizeLabel");
const imageCompressResultSizeLabel = document.querySelector("#imageCompressResultSizeLabel");
const imageCompressRatioHint = document.querySelector("#imageCompressRatioHint");
const undoMosaicRegionButton = document.querySelector("#undoMosaicRegionButton");
const clearMosaicRegionsButton = document.querySelector("#clearMosaicRegionsButton");
const downloadImageMosaicButton = document.querySelector("#downloadImageMosaicButton");
const imageMosaicCanvas = document.querySelector("#imageMosaicCanvas");
const imageMosaicStatus = document.querySelector("#imageMosaicStatus");
const imageMosaicRegionCount = document.querySelector("#imageMosaicRegionCount");
const imageOriginalSizeLabel = document.querySelector("#imageOriginalSizeLabel");
const imageProcessingSummary = document.querySelector("#imageProcessingSummary");
const imageMosaicCanvasWrap = document.querySelector("#imageTool .image-mosaic-canvas-wrap");
const imageZoomNav = document.querySelector("#imageZoomNav");
const imageZoomOutButton = document.querySelector("#imageZoomOutButton");
const imageZoomInButton = document.querySelector("#imageZoomInButton");
const imageZoomFitButton = document.querySelector("#imageZoomFitButton");
const imageZoomLabel = document.querySelector("#imageZoomLabel");
const resetImageEditsButton = document.querySelector("#resetImageEditsButton");
const saveImageTemplateButton = document.querySelector("#saveImageTemplateButton");
const imageEditorParams = document.querySelector("#imageEditorParams");
const imageParamsSubtitle = document.querySelector("#imageParamsSubtitle");
const imagePreviewActions = document.querySelector("#imageTool .image-preview-actions");

const IMAGE_TOOL_SUBTITLES = {
  crop: "在预览区拖拽框选裁剪范围",
  resize: "设置目标宽高，预览区将显示缩放效果",
  compress: "调整压缩质量，导出 JPG/WebP 时生效",
  format: "选择导出格式，支持 PNG/JPG/WebP 或转 PDF",
  tune: "调整亮度、对比度与色彩效果",
  watermark: "配置水印文字、样式和布局",
  mosaic: "在预览区拖拽框选需要打码的区域",
};

let authMode = "login";
let activeTool = "weightTool";
let activeWorkspacePage = "dashboard";
let selectedToolId = "weightTool";
let currentToolCategory = "all";
let managedUsers = [];
const toolDetails = {
  weightTool: {
    title: "体重趋势",
    shortTitle: "体重",
    description: "记录每日体重、目标体重、趋势图和 DeepSeek 明日分析。",
    category: "health",
    icon: "⚖",
    color: "green",
    gradient: "green-gradient",
    status: "enabled",
    statusText: "启用",
    owner: "个人健康",
    usage: "按账号统计",
  },
  pdfTool: {
    title: "PDF 处理",
    shortTitle: "PDF",
    description: "PDF 水印、遮盖打码、文档翻译、预览对照和下载，文本翻译经服务端处理。",
    category: "document",
    icon: "PDF",
    color: "blue",
    gradient: "blue-gradient",
    status: "enabled",
    statusText: "启用",
    owner: "PDF 处理",
    usage: "水印 / 打码 / 翻译",
  },
  imageTool: {
    title: "图片编辑",
    shortTitle: "图片",
    description: "图片裁剪、尺寸调整、压缩转格式、水印和亮度对比度等常用办公处理。",
    category: "image",
    icon: "▧",
    color: "purple",
    gradient: "purple-gradient",
    status: "enabled",
    statusText: "启用",
    owner: "图片处理",
    usage: "裁剪 / 压缩 / 水印 / 打码",
  },
  numberConverterTool: {
    title: "数字转大写",
    shortTitle: "大写",
    description: "将阿拉伯数字转换为中文大写金额（壹贰叁…）及中文小写（一二三…），适合财务凭证填写。",
    category: "utility",
    icon: "壹",
    color: "orange",
    gradient: "orange-gradient",
    status: "enabled",
    statusText: "启用",
    owner: "实用工具",
    usage: "本地转换",
  },
  adminView: {
    title: "账号管理",
    shortTitle: "账号",
    description: "新增、修改和删除账号信息，仅管理员可用。",
    category: "system",
    icon: "♙",
    color: "slate",
    gradient: "slate-gradient",
    status: "admin",
    statusText: "管理员",
    owner: "系统管理",
    usage: "权限控制",
    requiresAdmin: true,
  },
};
const toolCategoryNames = {
  all: "全部工具",
  health: "健康记录",
  document: "PDF 处理",
  image: "图片处理",
  utility: "实用工具",
  system: "系统管理",
};
const toolCategoryIcons = {
  all: "▦",
  health: "♡",
  document: "▤",
  image: "▧",
  utility: "◈",
  system: "⚙",
};
let isHistoryExpanded = false;
let savedDeepSeekAnalysis = defaultDeepSeekAnalysis();
let deepSeekUsage = { used: 0, limit: 3 };
let watermarkImage = null;
let watermarkPdfBytes = null;
let watermarkOutputUrl = "";
let watermarkFileType = "";
let watermarkFileName = "processed-pdf";
let watermarkSettings = defaultWatermarkSettings();
let pdfRedactions = [];
let activePdfTool = "watermark";
let currentPdfFileLabel = "";
let pdfPageCount = 0;
let pdfRedactionCurrentPage = 1;
let pdfRedactionDraftRegion = null;
let isDrawingPdfRedaction = false;
let pdfRedactionStartPoint = null;
let lastPdfPageLayout = null;
let pdfJsDocument = null;
let pdfJsDocumentBytesRef = null;
let pdfRedactionPageSnapshot = null;
let pdfRedactionZoom = 1;
const PDF_REDACTION_ZOOM_MIN = 0.5;
const PDF_REDACTION_ZOOM_MAX = 3;
const PDF_REDACTION_ZOOM_STEP = 1.2;
const PDF_REDACTION_PREVIEW_MAX_WIDTH = 860;
const PDF_REDACTION_MIN_CANVAS_SIZE = 1;
const PDF_REDACTION_MIN_PERCENT = 0.01;
let imageMosaicSource = null;
let imageMosaicFileName = "processed-image";
let imageOriginalFileSize = 0;
let imageMosaicSettings = defaultImageMosaicSettings();
let imageMosaicRegions = [];
let imageMosaicDraftRegion = null;
let isDrawingMosaic = false;
let imageMosaicStartPoint = null;
let activeImageEditTool = "crop";
let imageCropRegion = null;
let lastImageRenderLayout = null;
let imageEditHistory = [];
let imageEditHistoryIndex = -1;
let currentImageFileLabel = "";
let imagePreviewZoom = 1;
const IMAGE_PREVIEW_ZOOM_MIN = 0.5;
const IMAGE_PREVIEW_ZOOM_MAX = 3;
const IMAGE_PREVIEW_ZOOM_STEP = 1.2;
const IMAGE_PREVIEW_MAX_WIDTH = 860;

function defaultWatermarkSettings() {
  return {
    text: "仅供本人使用",
    font: "\"Noto Sans SC\", \"Source Han Sans SC\", sans-serif",
    size: 36,
    color: "#0f7f72",
    opacity: 0.22,
    angle: -28,
    gapX: 260,
    gapY: 180,
    mode: "repeat",
    redactionColor: "#111827",
    redactionType: "mosaic",
    redactionBlockSize: 18,
    redactionOpacity: 1,
  };
}

function defaultImageMosaicSettings() {
  return {
    blockSize: 18,
    format: "png",
    cropAspect: "free",
    resizeEnabled: false,
    resizeWidth: "",
    resizeHeight: "",
    keepRatio: true,
    quality: 0.82,
    backgroundColor: "#ffffff",
    watermarkEnabled: false,
    watermarkText: "仅供本人使用",
    watermarkMode: "repeat",
    watermarkSize: 36,
    watermarkColor: "#0f7f72",
    watermarkOpacity: 0.22,
    watermarkAngle: -28,
    brightness: 108,
    contrast: 112,
    saturation: 100,
    grayscale: false,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
}

function defaultDeepSeekAnalysis() {
  return {
    context: "",
    result: "",
    updatedAt: "",
  };
}

function defaultProfiles() {
  return {
    self: {
      settings: {
        target: "",
        height: "",
        gender: "unspecified",
      },
      records: [],
    },
  };
}

function normalizeProfiles(value) {
  const fallback = defaultProfiles();
  const source = value?.self || fallback.self;
  if (source?.name) {
    profileMeta.self.name = source.name;
    profileMeta.self.fileName = source.name;
  }
  return {
    self: {
      settings: { ...fallback.self.settings, ...(source?.settings || {}) },
      records: Array.isArray(source?.records) ? source.records : fallback.self.records,
    },
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`服务器返回了无法解析的响应：${text.slice(0, 120)}`);
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.detail || `请求失败：${response.status}`);
  }

  return data;
}

async function loadProfilesFromDatabase() {
  try {
    const databaseProfiles = await apiRequest("/profiles");
    profiles = normalizeProfiles(databaseProfiles);
    render();
  } catch (error) {
    document.querySelector("#summaryText").textContent =
      `数据库连接失败：${error.message}。请确认 PostgreSQL 容器和本地服务已启动。`;
  }
}

function setAuthMode(mode) {
  authMode = "login";
  authTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
  });
  displayNameLabel.classList.add("hidden");
  confirmPasswordLabel.classList.add("hidden");
  authSubmitButton.textContent = "登录";
  passwordInput.autocomplete = "current-password";
  passwordInput.placeholder = "";
  confirmPasswordInput.required = false;
  authMessage.textContent = "";
}

function getToolList() {
  return Object.entries(toolDetails)
    .map(([id, detail]) => ({ id, ...detail }))
    .filter((tool) => !tool.requiresAdmin || currentUser?.isAdmin);
}

function updateDashboardMeta() {
  const list = getToolList();
  const categories = new Set(list.map((tool) => tool.category));
  const roleText = currentUser?.isAdmin ? "管理员" : "成员";
  if (dashboardToolCount) dashboardToolCount.textContent = String(list.length);
  if (dashboardCategoryCount) dashboardCategoryCount.textContent = String(categories.size);
  if (dashboardRoleValue) dashboardRoleValue.textContent = roleText;
  if (toolRoleSummary) toolRoleSummary.textContent = roleText;
  if (sidebarRoleLabel) sidebarRoleLabel.textContent = roleText;
  if (topbarAvatar) {
    const avatarText = (profileMeta.self.name || currentUser?.username || "用").slice(0, 1);
    topbarAvatar.textContent = avatarText;
  }
  adminNavItems.forEach((item) => item.classList.toggle("hidden", !currentUser?.isAdmin));
  adminToolCard?.classList.toggle("hidden", !currentUser?.isAdmin);
}

function setActiveNav(pageId) {
  activeWorkspacePage = pageId;
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });
}

function hideWorkspacePages() {
  dashboardPage?.classList.add("hidden");
  toolHome.classList.add("hidden");
  adminView.classList.add("hidden");
  passwordPanel.classList.add("hidden");
  toolViews.forEach((view) => view.classList.add("hidden"));
}

function updateWorkspaceTopbar(options = {}) {
  const { title, greeting, detailToolMode = false } = options;
  appShell?.classList.toggle("is-tool-detail", detailToolMode);
  if (title) appTitle.textContent = title;
  if (greeting !== undefined) {
    document.querySelector("#userLabel").textContent = greeting;
  }
  if (globalSearchInput) {
    globalSearchInput.placeholder = detailToolMode ? "搜索工具/成员/记录" : "搜索工具";
  }
}

function showDashboard() {
  hideWorkspacePages();
  setActiveNav("dashboard");
  appEyebrow.textContent = "Dashboard";
  updateWorkspaceTopbar({
    title: "工具工作台",
    greeting: currentUser
      ? `当前账号：${profileMeta.self.name}（${currentUser.username}）`
      : "当前账号：--",
    detailToolMode: false,
  });
  backToToolsButton.classList.add("hidden");
  dashboardPage?.classList.remove("hidden");
  updateDashboardMeta();
}

function showApp(user) {
  currentUser = user;
  profileMeta.self.name = user.displayName || user.username;
  profileMeta.self.fileName = user.username || "self";
  document.querySelector("#userLabel").textContent =
    `当前账号：${profileMeta.self.name}（${user.username}）`;
  authShell.classList.add("hidden");
  appShell.classList.remove("hidden");
  changePasswordButton.classList.remove("hidden");
  logoutButton?.classList.remove("hidden");
  activeProfile = "self";
  selectedToolId = "weightTool";
  updateDashboardMeta();
  renderToolCenter();
  showDashboard();
  loadProfilesFromDatabase();
  loadWatermarkSettings();
  loadImageMosaicSettings();
  loadDeepSeekAnalysis();
  loadDeepSeekUsage();
  if (user.isAdmin) {
    loadManagedUsers();
  }
}

function showAuth(message = "") {
  currentUser = null;
  authShell.classList.remove("hidden");
  appShell.classList.add("hidden");
  hideWorkspacePages();
  changePasswordButton.classList.add("hidden");
  logoutButton?.classList.add("hidden");
  authMessage.textContent = message;
}

function showToolHome() {
  hideWorkspacePages();
  setActiveNav("tools");
  appEyebrow.textContent = "Toolbox";
  updateWorkspaceTopbar({
    title: "工具中心",
    greeting: currentUser
      ? `当前账号：${profileMeta.self.name}（${currentUser.username}）`
      : "当前账号：--",
    detailToolMode: false,
  });
  backToToolsButton.classList.add("hidden");
  toolHome.classList.remove("hidden");
  renderToolCenter();
}

function getCategoryCounts() {
  const counts = { all: getToolList().length };
  getToolList().forEach((tool) => {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  });
  return counts;
}

function renderToolCategories() {
  if (!toolCategoryList) return;
  const counts = getCategoryCounts();
  const categories = Object.keys(toolCategoryNames).filter(
    (category) => category === "all" || counts[category],
  );
  toolCategoryList.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.type = "button";
    button.dataset.category = category;
    button.classList.toggle("active", currentToolCategory === category);
    button.innerHTML = `
      <span class="category-left">
        <span aria-hidden="true">${toolCategoryIcons[category]}</span>
        ${escapeHtml(toolCategoryNames[category])}
      </span>
      <span class="category-count">${counts[category] || 0}</span>
    `;
    button.addEventListener("click", () => {
      currentToolCategory = category;
      renderToolCenter();
    });
    toolCategoryList.appendChild(button);
  });
}

function getFilteredTools() {
  const keyword = (toolSearchInput?.value || "").trim().toLowerCase();
  const status = toolStatusFilter?.value || "all";
  const sort = toolSortFilter?.value || "default";
  const list = getToolList().filter((tool) => {
    const categoryName = toolCategoryNames[tool.category] || "";
    const matchCategory = currentToolCategory === "all" || tool.category === currentToolCategory;
    const matchStatus = status === "all" || tool.status === status;
    const haystack = `${tool.title} ${tool.shortTitle} ${tool.description} ${categoryName}`.toLowerCase();
    return matchCategory && matchStatus && (!keyword || haystack.includes(keyword));
  });

  return list.sort((first, second) => {
    if (sort === "name") return first.title.localeCompare(second.title, "zh-CN");
    if (sort === "category") {
      return (toolCategoryNames[first.category] || "").localeCompare(
        toolCategoryNames[second.category] || "",
        "zh-CN",
      );
    }
    return Object.keys(toolDetails).indexOf(first.id) - Object.keys(toolDetails).indexOf(second.id);
  });
}

function renderToolGrid() {
  if (!toolGrid) return;
  const list = getFilteredTools();
  const fallback = getToolList()[0];

  if (!list.some((tool) => tool.id === selectedToolId)) {
    selectedToolId = list[0]?.id || fallback?.id || "weightTool";
  }

  if (visibleToolCount) visibleToolCount.textContent = String(list.length);
  if (enabledToolCount) {
    enabledToolCount.textContent = String(getToolList().filter((tool) => tool.status === "enabled").length);
  }
  if (currentCategoryName) {
    currentCategoryName.textContent = toolCategoryNames[currentToolCategory] || "全部工具";
  }

  toolGrid.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-tool-state";
    empty.textContent = "没有找到匹配的工具";
    toolGrid.appendChild(empty);
    renderToolSideDetail();
    return;
  }

  list.forEach((tool) => {
    const card = document.createElement("button");
    card.className = "tool-app-card";
    card.type = "button";
    card.dataset.toolCard = tool.id;
    card.classList.toggle("active", tool.id === selectedToolId);
    card.innerHTML = `
      <div class="tool-card-head">
        <div class="tool-icon ${tool.color}" aria-hidden="true">${escapeHtml(tool.icon)}</div>
        <span class="tool-status ${tool.status}">${escapeHtml(tool.statusText)}</span>
      </div>
      <h4>${escapeHtml(tool.title)}</h4>
      <p>${escapeHtml(tool.description)}</p>
      <div class="tool-card-footer">
        <span class="category-label">${escapeHtml(toolCategoryNames[tool.category] || "未分类")} · ${escapeHtml(tool.usage)}</span>
        <span class="open-btn">进入</span>
      </div>
    `;
    card.addEventListener("click", () => {
      selectedToolId = tool.id;
      renderToolCenter();
    });
    card.addEventListener("dblclick", () => {
      enterSelectedTool();
    });
    toolGrid.appendChild(card);
  });
  renderToolSideDetail();
}

function renderToolSideDetail() {
  if (!toolSideDetail) return;
  const tool = getToolList().find((item) => item.id === selectedToolId) || getToolList()[0];
  if (!tool) {
    toolSideDetail.innerHTML = "";
    return;
  }

  const adminActions = currentUser?.isAdmin
    ? `
        <button class="secondary-button compact-button" type="button" data-side-action="admin">
          账号管理
        </button>
      `
    : "";

  toolSideDetail.innerHTML = `
    <div class="side-hero ${tool.gradient}">
      <div class="side-icon" aria-hidden="true">${escapeHtml(tool.icon)}</div>
      <h3>${escapeHtml(tool.title)}</h3>
      <p>${escapeHtml(tool.description)}</p>
    </div>

    <div class="side-info">
      <div class="side-info-item"><span>所属分类</span><strong>${escapeHtml(toolCategoryNames[tool.category] || "未分类")}</strong></div>
      <div class="side-info-item"><span>工具状态</span><strong>${escapeHtml(tool.statusText)}</strong></div>
      <div class="side-info-item"><span>使用范围</span><strong>${escapeHtml(tool.usage)}</strong></div>
      <div class="side-info-item"><span>负责人</span><strong>${escapeHtml(tool.owner)}</strong></div>
    </div>

    <div class="mini-preview">
      <h4>工具能力摘要</h4>
      <div class="mini-row">按账号保存数据和配置</div>
      <div class="mini-row">支持从工具中心快速进入</div>
      <div class="mini-row">与现有后端接口保持一致</div>
    </div>

    <div class="side-actions">
      <button class="primary-button compact-button" type="button" data-side-action="enter">
        进入工具
      </button>
      ${adminActions}
    </div>
  `;

  toolSideDetail.querySelector('[data-side-action="enter"]')?.addEventListener("click", enterSelectedTool);
  toolSideDetail.querySelector('[data-side-action="admin"]')?.addEventListener("click", showAdminManagement);
}

function renderToolCenter() {
  updateDashboardMeta();
  renderToolCategories();
  renderToolGrid();
}

function enterSelectedTool() {
  if (selectedToolId === "adminView") {
    showAdminManagement();
    return;
  }
  switchTool(selectedToolId);
}

async function loadManagedUsers() {
  try {
    const data = await apiRequest("/users");
    managedUsers = data.users || [];
    renderManagedUsers();
  } catch (error) {
    accountMessage.textContent = error.message;
  }
}

function resetAccountForm(options = {}) {
  accountIdInput.value = "";
  accountUsernameInput.value = "";
  accountUsernameInput.disabled = false;
  accountDisplayNameInput.value = "";
  accountPasswordInput.value = "";
  accountPasswordInput.required = true;
  accountPasswordInput.placeholder = "";
  if (accountRoleInput) accountRoleInput.value = "member";
  accountSubmitButton.textContent = "新增账号";
  if (accountFormMessage) accountFormMessage.textContent = "";
  if (!options.keepOpen && accountMessage) accountMessage.textContent = "";
}

function getMemberDisplayName(user) {
  return (user.displayName || user.username || "").trim() || user.username;
}

function getMemberInitial(name) {
  const text = String(name || "").trim();
  if (!text) return "?";
  return text.slice(0, 1);
}

function getUserToolPermissionsLabel(user) {
  if (user.isAdmin) return "全部工具";
  return getToolList()
    .filter((tool) => tool.id !== "adminView")
    .map((tool) => tool.shortTitle || tool.title)
    .join("，");
}

function formatAccountLastSeen(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const time = date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (date >= startOfToday) return `今天 ${time}`;
  if (date >= startOfYesterday) return `昨天 ${time}`;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function openAccountModal(mode = "create", user = null) {
  if (!accountModal) return;
  const isEdit = mode === "edit" && user;
  resetAccountForm({ keepOpen: true });
  if (isEdit) {
    accountIdInput.value = user.id;
    accountUsernameInput.value = user.username;
    accountUsernameInput.disabled = true;
    accountDisplayNameInput.value = user.displayName || "";
    accountPasswordInput.value = "";
    accountPasswordInput.required = false;
    accountPasswordInput.placeholder = "不填写则保持原密码";
    if (accountRoleInput) accountRoleInput.value = user.isAdmin ? "admin" : "member";
    accountSubmitButton.textContent = "保存修改";
    if (accountModalTitle) accountModalTitle.textContent = "编辑账号";
    if (accountModalSubtitle) accountModalSubtitle.textContent = `修改 ${getMemberDisplayName(user)} 的信息`;
  } else {
    if (accountModalTitle) accountModalTitle.textContent = "新增账号";
    if (accountModalSubtitle) accountModalSubtitle.textContent = "填写成员信息并设置角色";
  }
  accountModal.classList.remove("hidden");
  accountModal.setAttribute("aria-hidden", "false");
  accountUsernameInput.focus();
}

function closeAccountModal() {
  accountModal?.classList.add("hidden");
  accountModal?.setAttribute("aria-hidden", "true");
  resetAccountForm({ keepOpen: true });
}

function renderManagedUsers() {
  if (!accountsBody) return;
  accountsBody.innerHTML = "";

  if (!managedUsers.length) {
    accountsBody.innerHTML = `
      <tr>
        <td colspan="6" class="admin-account-empty">暂无成员账号，点击右上角「新增账号」开始添加。</td>
      </tr>
    `;
    return;
  }

  managedUsers.forEach((user) => {
    const displayName = getMemberDisplayName(user);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="admin-member-cell">
          <span class="admin-member-avatar" aria-hidden="true">${escapeHtml(getMemberInitial(displayName))}</span>
          <span class="admin-member-name">${escapeHtml(displayName)}</span>
        </div>
      </td>
      <td><span class="admin-role-text">${user.isAdmin ? "管理员" : "普通成员"}</span></td>
      <td><span class="admin-status-tag is-enabled">启用</span></td>
      <td class="admin-tools-cell">${escapeHtml(getUserToolPermissionsLabel(user))}</td>
      <td class="admin-login-cell">${escapeHtml(formatAccountLastSeen(user.createdAt))}</td>
      <td class="admin-account-table__actions-col"></td>
    `;

    const actionsCell = row.lastElementChild;
    if (user.id === currentUser?.id) {
      actionsCell.innerHTML = `<span class="admin-current-account">当前账号</span>`;
    } else {
      const actionsWrap = document.createElement("div");
      actionsWrap.className = "admin-row-actions";

      const editButton = document.createElement("button");
      editButton.className = "secondary-button table-button";
      editButton.type = "button";
      editButton.textContent = "编辑";
      editButton.addEventListener("click", () => openAccountModal("edit", user));
      actionsWrap.appendChild(editButton);

      if (user.username !== "admin") {
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button table-button";
        deleteButton.type = "button";
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", async () => {
          if (!confirm(`确定删除账号 ${user.username} 吗？`)) return;
          try {
            await apiRequest(`/users?id=${encodeURIComponent(user.id)}`, { method: "DELETE" });
            if (accountMessage) accountMessage.textContent = `已删除账号 ${user.username}`;
            await loadManagedUsers();
          } catch (error) {
            if (accountMessage) accountMessage.textContent = error.message;
          }
        });
        actionsWrap.appendChild(deleteButton);
      }

      actionsCell.appendChild(actionsWrap);
    }

    accountsBody.appendChild(row);
  });
}

async function checkSession() {
  try {
    const data = await apiRequest("/me");
    if (data.user) {
      showApp(data.user);
    } else {
      showAuth();
    }
  } catch {
    showAuth("无法检查登录状态，请确认后端服务已启动。");
  }
}

function switchTool(toolId) {
  if (!toolDetails[toolId] || toolDetails[toolId].requiresAdmin) return;
  activeTool = toolId;
  selectedToolId = toolId;
  hideWorkspacePages();
  setActiveNav("tools");
  appEyebrow.textContent = "Tool";
  const roleText = currentUser?.isAdmin ? "管理员" : "成员";
  if (toolId === "imageTool" || toolId === "pdfTool") {
    updateWorkspaceTopbar({
      title: toolDetails[toolId]?.title || "工具详情",
      greeting: `欢迎回来，${roleText}`,
      detailToolMode: true,
    });
  } else {
    updateWorkspaceTopbar({
      title: toolDetails[toolId]?.title || "工具详情",
      greeting: currentUser
        ? `当前账号：${profileMeta.self.name}（${currentUser.username}）`
        : "当前账号：--",
      detailToolMode: false,
    });
  }
  backToToolsButton.classList.add("hidden");
  toolButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === toolId);
  });
  toolViews.forEach((view) => {
    view.classList.toggle("hidden", view.id !== toolId);
  });
  if (toolId === "pdfTool") {
    setActivePdfTool(activePdfTool);
    drawWatermarkPreview();
  }
  if (toolId === "imageTool") {
    setActiveImageTool(activeImageEditTool, { preserveUpload: true });
  }
  if (toolId === "weightTool") {
    requestAnimationFrame(renderChart);
  }
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
}

function showAdminManagement() {
  if (!currentUser?.isAdmin) return;
  hideWorkspacePages();
  setActiveNav("admin");
  appEyebrow.textContent = "Admin";
  updateWorkspaceTopbar({
    title: "账号管理",
    greeting: "欢迎回来，管理员",
    detailToolMode: false,
  });
  backToToolsButton.classList.remove("hidden");
  adminView.classList.remove("hidden");
  closeAccountModal();
  loadManagedUsers();
}

function showPasswordPage() {
  hideWorkspacePages();
  setActiveNav("password");
  appEyebrow.textContent = "Account";
  updateWorkspaceTopbar({
    title: "系统设置",
    greeting: currentUser
      ? `当前账号：${profileMeta.self.name}（${currentUser.username}）`
      : "当前账号：--",
    detailToolMode: false,
  });
  backToToolsButton.classList.remove("hidden");
  passwordMessage.textContent = "";
  oldPasswordInput.value = "";
  newPasswordInput.value = "";
  repeatNewPasswordInput.value = "";
  passwordPanel.classList.remove("hidden");
  oldPasswordInput.focus();
}

async function loadWatermarkSettings() {
  try {
    const data = await apiRequest(`/tool-settings?tool=${encodeURIComponent(PDF_PROCESSING_TOOL_KEY)}`);
    watermarkSettings = { ...defaultWatermarkSettings(), ...(data.settings || {}) };
    renderWatermarkSettings();
  } catch {
    watermarkSettings = defaultWatermarkSettings();
    renderWatermarkSettings();
  }
}

async function loadImageMosaicSettings() {
  try {
    const data = await apiRequest(`/tool-settings?tool=${encodeURIComponent(IMAGE_PROCESSING_TOOL_KEY)}`);
    imageMosaicSettings = { ...defaultImageMosaicSettings(), ...(data.settings || {}) };
    renderImageMosaicSettings();
  } catch {
    imageMosaicSettings = defaultImageMosaicSettings();
    renderImageMosaicSettings();
  }
}

async function loadDeepSeekAnalysis() {
  try {
    const data = await apiRequest(`/tool-settings?tool=${encodeURIComponent(DEEPSEEK_ANALYSIS_TOOL_KEY)}`);
    savedDeepSeekAnalysis = { ...defaultDeepSeekAnalysis(), ...(data.settings || {}) };
  } catch {
    savedDeepSeekAnalysis = defaultDeepSeekAnalysis();
  }
  renderDeepSeekAnalysis();
}

async function loadDeepSeekUsage() {
  try {
    const data = await apiRequest("/deepseek/usage");
    deepSeekUsage = {
      used: Number(data.used || 0),
      limit: Number(data.limit || 3),
    };
  } catch {
    deepSeekUsage = { used: 0, limit: 3 };
  }
  renderDeepSeekUsage();
}

function renderDeepSeekUsage() {
  const used = Number(deepSeekUsage.used || 0);
  const limit = Number(deepSeekUsage.limit || 3);
  deepSeekUsageLabel.textContent = `今日已分析 ${used} / ${limit} 次`;
  deepSeekUsageLabel.classList.toggle("is-full", used >= limit);
}

async function saveDeepSeekAnalysis() {
  await apiRequest("/tool-settings", {
    method: "POST",
    body: JSON.stringify({
      tool: DEEPSEEK_ANALYSIS_TOOL_KEY,
      settings: savedDeepSeekAnalysis,
    }),
  });
}

function renderDeepSeekAnalysis() {
  analysisContextInput.value = savedDeepSeekAnalysis.context || "";

  if (!savedDeepSeekAnalysis.result) {
    aiOutput.textContent =
      "点击生成，会结合近期体重、记录备注和你填写的额外信息，分析明日体重和影响因素。建议仅作日常记录参考。";
    return;
  }

  const updatedAt = formatDateTime(savedDeepSeekAnalysis.updatedAt);
  aiOutput.innerHTML = [
    updatedAt ? `<p class="analysis-meta">上次分析：${updatedAt}</p>` : "",
    markdownToHtml(savedDeepSeekAnalysis.result),
  ].join("");
}

async function saveWatermarkSettings() {
  watermarkSettings = readWatermarkSettings();
  await apiRequest("/tool-settings", {
    method: "POST",
    body: JSON.stringify({
      tool: PDF_PROCESSING_TOOL_KEY,
      settings: watermarkSettings,
    }),
  });
}

function updateWatermarkOpacityLabel() {
  if (!watermarkOpacityValue) return;
  const opacity = Number(watermarkOpacityInput?.value || watermarkSettings.opacity || 0.22);
  watermarkOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
}

function updatePdfFileLabel(name = "") {
  currentPdfFileLabel = name;
  if (pdfFileNameLabel) {
    pdfFileNameLabel.textContent = name || "未选择文件";
  }
}

function updatePdfPreviewPlaceholder() {
  const hasPdf = Boolean(watermarkPdfBytes);
  const useSingleCanvas = hasPdf && (activePdfTool === "redaction" || activePdfTool === "watermark");
  pdfPreviewPlaceholder?.classList.toggle("hidden", hasPdf);
  pdfSinglePreviewWrap?.classList.toggle("hidden", false);
  watermarkCanvas?.classList.toggle("hidden", !useSingleCanvas);
  watermarkCanvas?.classList.toggle("has-pdf", useSingleCanvas);
  watermarkCanvas?.classList.toggle("is-selectable", hasPdf && activePdfTool === "redaction");
  watermarkPdfPreview?.classList.add("hidden");
  watermarkPdfPreview?.classList.remove("has-pdf");
  updatePdfPreviewChrome();
}

function updatePdfPreviewChrome() {
  const showPreviewChrome =
    Boolean(watermarkPdfBytes) &&
    pdfPageCount > 0 &&
    ["redaction", "watermark"].includes(activePdfTool);
  pdfPageNav?.classList.toggle("hidden", !showPreviewChrome);
  pdfZoomNav?.classList.toggle("hidden", !showPreviewChrome);
  if (pdfPageNavLabel && pdfPageCount > 0) {
    pdfPageNavLabel.textContent = `第 ${pdfRedactionCurrentPage} / ${pdfPageCount} 页`;
  }
  if (pdfZoomLabel) {
    pdfZoomLabel.textContent = `${Math.round(pdfRedactionZoom * 100)}%`;
  }
  if (pdfPrevPageButton) {
    pdfPrevPageButton.disabled = pdfRedactionCurrentPage <= 1;
  }
  if (pdfNextPageButton) {
    pdfNextPageButton.disabled = pdfRedactionCurrentPage >= pdfPageCount;
  }
  if (pdfZoomOutButton) {
    pdfZoomOutButton.disabled = pdfRedactionZoom <= PDF_REDACTION_ZOOM_MIN + 0.001;
  }
  if (pdfZoomInButton) {
    pdfZoomInButton.disabled = pdfRedactionZoom >= PDF_REDACTION_ZOOM_MAX - 0.001;
  }
  if (pdfRedactionPageInput && document.activeElement !== pdfRedactionPageInput) {
    pdfRedactionPageInput.value = String(pdfRedactionCurrentPage);
  }
}

function getPdfRedactionFitScale(page) {
  const baseViewport = page.getViewport({ scale: 1 });
  return Math.min(2, PDF_REDACTION_PREVIEW_MAX_WIDTH / baseViewport.width);
}

function getPdfRedactionRenderScale(page) {
  return getPdfRedactionFitScale(page) * pdfRedactionZoom;
}

function setPdfRedactionZoom(nextZoom, options = {}) {
  const clamped = clampNumber(nextZoom, PDF_REDACTION_ZOOM_MIN, PDF_REDACTION_ZOOM_MAX);
  if (!options.force && Math.abs(clamped - pdfRedactionZoom) < 0.001) {
    updatePdfPreviewChrome();
    return;
  }
  pdfRedactionZoom = clamped;
  pdfRedactionPageSnapshot = null;
  updatePdfPreviewChrome();
  if (watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
}

function adjustPdfRedactionZoom(multiplier) {
  setPdfRedactionZoom(pdfRedactionZoom * multiplier);
}

function updatePdfMeta() {
  if (pdfPageCountLabel) {
    pdfPageCountLabel.textContent = pdfPageCount > 0 ? `${pdfPageCount} 页` : "--";
  }
  if (pdfRedactionSummaryLabel) {
    pdfRedactionSummaryLabel.textContent = `${pdfRedactions.length} 个`;
  }
  if (pdfRedactionCount) {
    pdfRedactionCount.textContent = `${pdfRedactions.length} 个打码区域`;
  }
}

function clearPdfUpload() {
  revokeWatermarkOutputUrl();
  watermarkImage = null;
  watermarkPdfBytes = null;
  watermarkFileType = "";
  watermarkFileName = "processed-pdf";
  pdfPageCount = 0;
  pdfRedactions = [];
  pdfRedactionCurrentPage = 1;
  pdfRedactionZoom = 1;
  pdfRedactionDraftRegion = null;
  isDrawingPdfRedaction = false;
  pdfRedactionStartPoint = null;
  lastPdfPageLayout = null;
  invalidatePdfJsDocument();
  if (watermarkImageInput) {
    watermarkImageInput.value = "";
  }
  updatePdfFileLabel("");
  renderPdfRedactions();
  updatePdfMeta();
  updatePdfPreviewPlaceholder();
  if (watermarkStatus) {
    watermarkStatus.textContent = "已切换工具，请重新上传 PDF。";
  }
}

function normalizePdfToolName(tool) {
  if (tool === "redaction") return tool;
  return "watermark";
}

function setActivePdfTool(tool, options = {}) {
  const nextTool = normalizePdfToolName(tool);
  const toolChanged = nextTool !== activePdfTool;
  if (toolChanged && !options.preserveUpload) {
    clearPdfUpload();
  }
  activePdfTool = nextTool;
  document.querySelectorAll("#pdfTool [data-pdf-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.pdfTool === activePdfTool);
  });
  if (pdfEditorParams) {
    pdfEditorParams.dataset.activePanel = activePdfTool;
  }
  document.querySelectorAll("#pdfTool [data-pdf-panel]").forEach((block) => {
    block.classList.toggle("hidden", block.dataset.pdfPanel !== activePdfTool);
  });
  if (pdfParamsSubtitle) {
    const subtitles = {
      redaction: "在预览区拖拽框选打码区域，可多次框选",
      watermark: "配置水印文字、样式和布局参数",
    };
    pdfParamsSubtitle.textContent = subtitles[activePdfTool] || subtitles.watermark;
  }
  updatePdfRedactionParamVisibility();
  if (toolChanged) {
    pdfRedactionCurrentPage = 1;
    pdfRedactionZoom = 1;
    pdfRedactionPageSnapshot = null;
  }
  updatePdfPreviewChrome();
  if (toolChanged || watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
}

function renderWatermarkSettings() {
  updateWatermarkOpacityLabel();
  const fontExists = [...watermarkFontInput.options].some((option) => option.value === watermarkSettings.font);
  if (!fontExists) {
    watermarkSettings.font = watermarkFontInput.options[0]?.value || defaultWatermarkSettings().font;
  }

  watermarkTextInput.value = watermarkSettings.text;
  watermarkFontInput.value = watermarkSettings.font;
  watermarkSizeInput.value = watermarkSettings.size;
  watermarkColorInput.value = watermarkSettings.color;
  watermarkOpacityInput.value = watermarkSettings.opacity;
  watermarkAngleInput.value = watermarkSettings.angle;
  watermarkGapXInput.value = watermarkSettings.gapX;
  watermarkGapYInput.value = watermarkSettings.gapY;
  watermarkModeInput.value = watermarkSettings.mode;
  if (pdfRedactionColorInput) {
    pdfRedactionColorInput.value = watermarkSettings.redactionColor || "#111827";
  }
  if (pdfRedactionTypeInput) {
    pdfRedactionTypeInput.value = watermarkSettings.redactionType || "mosaic";
  }
  if (pdfRedactionBlockSizeInput) {
    pdfRedactionBlockSizeInput.value = watermarkSettings.redactionBlockSize || 18;
  }
  if (pdfRedactionOpacityInput) {
    pdfRedactionOpacityInput.value = watermarkSettings.redactionOpacity ?? 1;
  }
  updatePdfRedactionParamVisibility();
  renderPdfRedactions();
}

function readPdfRedactionSettings() {
  return {
    type: pdfRedactionTypeInput?.value === "mosaic" ? "mosaic" : "solid",
    color: pdfRedactionColorInput?.value || "#111827",
    blockSize: clampNumber(Number(pdfRedactionBlockSizeInput?.value || 18), 4, 72),
    opacity: clampNumber(Number(pdfRedactionOpacityInput?.value ?? 1), 0.05, 1),
  };
}

function getPdfRedactionOpacity(redaction) {
  if (redaction?.type === "mosaic") return 1;
  return clampNumber(Number(redaction?.opacity ?? 1), 0.05, 1);
}

function updatePdfRedactionOpacityLabel() {
  if (!pdfRedactionOpacityValue) return;
  const opacity = readPdfRedactionSettings().opacity;
  pdfRedactionOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
}

function updatePdfRedactionParamVisibility() {
  const settings = readPdfRedactionSettings();
  const isMosaic = settings.type === "mosaic";
  pdfRedactionColorField?.classList.toggle("hidden", isMosaic);
  pdfRedactionOpacityField?.classList.toggle("hidden", isMosaic);
  pdfRedactionBlockField?.classList.toggle("hidden", !isMosaic);
  updatePdfRedactionOpacityLabel();
  if (pdfRedactionBlockValue) {
    pdfRedactionBlockValue.textContent = String(settings.blockSize);
  }
}

function getPdfRedactionTypeLabel(type) {
  return type === "mosaic" ? "马赛克" : "纯色";
}

function readWatermarkSettings() {
  return {
    text: watermarkTextInput.value.trim() || "仅供本人使用",
    font: watermarkFontInput.value,
    size: Number(watermarkSizeInput.value || 36),
    color: watermarkColorInput.value || "#0f7f72",
    opacity: Number(watermarkOpacityInput.value || 0.22),
    angle: Number(watermarkAngleInput.value || -28),
    gapX: Number(watermarkGapXInput.value || 260),
    gapY: Number(watermarkGapYInput.value || 180),
    mode: watermarkModeInput.value || "repeat",
    redactionColor: pdfRedactionColorInput?.value || "#111827",
    redactionType: pdfRedactionTypeInput?.value === "mosaic" ? "mosaic" : "solid",
    redactionBlockSize: clampNumber(Number(pdfRedactionBlockSizeInput?.value || 18), 4, 72),
    redactionOpacity: clampNumber(Number(pdfRedactionOpacityInput?.value ?? 1), 0.05, 1),
  };
}

function normalizePdfRedaction(redaction) {
  const page = Math.max(1, Math.round(Number(redaction.page || 1)));
  const x = clampNumber(Number(redaction.x || 0), 0, 100);
  const y = clampNumber(Number(redaction.y || 0), 0, 100);
  const width = clampPdfRedactionSpan(redaction.width, 100 - x);
  const height = clampPdfRedactionSpan(redaction.height, 100 - y);
  const settings = readPdfRedactionSettings();
  const type =
    redaction.type === "mosaic" || redaction.type === "solid" ? redaction.type : settings.type;
  return {
    page,
    x,
    y,
    width,
    height,
    type,
    color: redaction.color || settings.color || "#111827",
    blockSize: clampNumber(Number(redaction.blockSize || settings.blockSize || 18), 4, 72),
    opacity:
      type === "mosaic"
        ? 1
        : clampNumber(Number(redaction.opacity ?? settings.opacity ?? 1), 0.05, 1),
  };
}

function clampPdfRedactionSpan(value, max) {
  if (max <= 0) return 0;
  const min = Math.min(PDF_REDACTION_MIN_PERCENT, max);
  const numeric = Number(value);
  return clampNumber(Number.isFinite(numeric) ? numeric : min, min, max);
}

function addPdfRedaction(redaction) {
  const normalized = normalizePdfRedaction(redaction);
  if (normalized.width < PDF_REDACTION_MIN_PERCENT || normalized.height < PDF_REDACTION_MIN_PERCENT) {
    return false;
  }
  pdfRedactions.push(normalized);
  renderPdfRedactions();
  return true;
}

function renderPdfRedactions() {
  if (!pdfRedactionCount || !pdfRedactionList) return;
  updatePdfMeta();
  pdfRedactionList.innerHTML = "";

  if (!pdfRedactions.length) {
    pdfRedactionList.innerHTML = `<div class="mini-row">还没有添加打码区域</div>`;
    return;
  }

  pdfRedactions.forEach((redaction, index) => {
    const item = document.createElement("div");
    item.className = "redaction-item";
    item.innerHTML = `
      <span>第 ${redaction.page} 页 · ${getPdfRedactionTypeLabel(redaction.type)} · 左 ${redaction.x}% · 上 ${redaction.y}% · ${redaction.width}% x ${redaction.height}%</span>
      <button type="button" class="secondary-button table-button" data-redaction-index="${index}">删除</button>
    `;
    pdfRedactionList.appendChild(item);
  });
}

function undoLastPdfRedaction() {
  if (!pdfRedactions.length) return;
  pdfRedactions.pop();
  renderPdfRedactions();
  void drawWatermarkPreview();
}

const PDFJS_WORKER_SRC = "./vendor/pdf.worker.min.js";

function ensurePdfJsWorker() {
  if (!window.pdfjsLib) return false;
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  }
  return true;
}

async function getPdfJsDocument() {
  if (!watermarkPdfBytes || !ensurePdfJsWorker()) return null;
  if (pdfJsDocument && pdfJsDocumentBytesRef === watermarkPdfBytes) {
    return pdfJsDocument;
  }
  pdfJsDocument = await pdfjsLib.getDocument({ data: watermarkPdfBytes.slice(0) }).promise;
  pdfJsDocumentBytesRef = watermarkPdfBytes;
  return pdfJsDocument;
}

function invalidatePdfJsDocument() {
  pdfJsDocument = null;
  pdfJsDocumentBytesRef = null;
  pdfRedactionPageSnapshot = null;
}

function setPdfRedactionPage(page) {
  const maxPage = Math.max(1, pdfPageCount || 1);
  const nextPage = clampNumber(Math.round(Number(page || 1)), 1, maxPage);
  if (nextPage === pdfRedactionCurrentPage) {
    updatePdfPreviewChrome();
    return;
  }
  pdfRedactionCurrentPage = nextPage;
  pdfRedactionDraftRegion = null;
  pdfRedactionPageSnapshot = null;
  updatePdfPreviewChrome();
  void drawWatermarkPreview();
}

function percentRedactionToCanvasRect(redaction, layout) {
  if (!layout) return null;
  const x = (layout.canvasWidth * redaction.x) / 100;
  const y = (layout.canvasHeight * redaction.y) / 100;
  const width = (layout.canvasWidth * redaction.width) / 100;
  const height = (layout.canvasHeight * redaction.height) / 100;
  return { x, y, width, height };
}

function canvasRectToPercentRedaction(rect, layout) {
  if (!layout || !rect) return null;
  const x1 = clampNumber(Math.min(rect.x, rect.x + rect.width), 0, layout.canvasWidth);
  const y1 = clampNumber(Math.min(rect.y, rect.y + rect.height), 0, layout.canvasHeight);
  const x2 = clampNumber(Math.max(rect.x, rect.x + rect.width), 0, layout.canvasWidth);
  const y2 = clampNumber(Math.max(rect.y, rect.y + rect.height), 0, layout.canvasHeight);
  const widthPx = x2 - x1;
  const heightPx = y2 - y1;
  if (widthPx < PDF_REDACTION_MIN_CANVAS_SIZE || heightPx < PDF_REDACTION_MIN_CANVAS_SIZE) return null;
  return normalizePdfRedaction({
    page: layout.page,
    x: (x1 / layout.canvasWidth) * 100,
    y: (y1 / layout.canvasHeight) * 100,
    width: (widthPx / layout.canvasWidth) * 100,
    height: (heightPx / layout.canvasHeight) * 100,
    type: readPdfRedactionSettings().type,
    color: readPdfRedactionSettings().color,
    blockSize: readPdfRedactionSettings().blockSize,
    opacity: readPdfRedactionSettings().opacity,
  });
}

function drawPdfRedactionOverlay(ctx, redaction, layout, variant = "saved") {
  const rect = percentRedactionToCanvasRect(redaction, layout);
  if (!rect) return;
  const region = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
  const type = redaction.type === "mosaic" ? "mosaic" : "solid";

  if (type === "mosaic") {
    if (variant === "saved") {
      drawMosaicRegion(ctx, watermarkCanvas, region, redaction.blockSize || 18);
    } else {
      drawMosaicRegion(ctx, watermarkCanvas, region, redaction.blockSize || 18);
    }
    ctx.save();
    ctx.strokeStyle = variant === "draft" ? "#2563eb" : "#020617";
    ctx.lineWidth = Math.max(2, Math.round(layout.canvasWidth / 520));
    ctx.setLineDash(variant === "draft" ? [10, 8] : []);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
    return;
  }

  const { r, g, b } = hexToRgb(redaction.color || "#111827");
  const opacity = getPdfRedactionOpacity(redaction);
  const fillOpacity = variant === "draft" ? Math.max(opacity, 0.2) : opacity;
  ctx.save();
  if (variant === "draft") {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
    ctx.strokeStyle = "#2563eb";
    ctx.setLineDash([10, 8]);
  } else {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.strokeStyle = "#020617";
    ctx.setLineDash([]);
  }
  ctx.lineWidth = Math.max(2, Math.round(layout.canvasWidth / 520));
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();
}

async function renderPdfPreviewPageBase() {
  if (!watermarkCanvas || !watermarkPdfBytes) {
    lastPdfPageLayout = null;
    return null;
  }

  if (!ensurePdfJsWorker()) {
    watermarkStatus.textContent = "PDF 预览需要加载 pdf.js，请强制刷新页面后重试。";
    return null;
  }

  const pdfDoc = await getPdfJsDocument();
  if (!pdfDoc) return null;

  pdfPageCount = pdfDoc.numPages;
  pdfRedactionCurrentPage = clampNumber(pdfRedactionCurrentPage, 1, pdfPageCount);
  updatePdfMeta();
  updatePdfPreviewChrome();

  const page = await pdfDoc.getPage(pdfRedactionCurrentPage);
  const scale = getPdfRedactionRenderScale(page);
  const viewport = page.getViewport({ scale });
  const ctx = watermarkCanvas.getContext("2d");
  watermarkCanvas.width = Math.round(viewport.width);
  watermarkCanvas.height = Math.round(viewport.height);
  lastPdfPageLayout = {
    page: pdfRedactionCurrentPage,
    canvasWidth: watermarkCanvas.width,
    canvasHeight: watermarkCanvas.height,
  };

  await page.render({ canvasContext: ctx, viewport }).promise;
  return ctx;
}

function drawCanvasWatermarkOverlay(ctx, settings, width, height) {
  if (settings.mode === "center") {
    drawWatermarkText(ctx, settings, width / 2, height / 2);
    return;
  }
  if (settings.mode === "bottomRight") {
    ctx.font = `900 ${settings.size}px ${settings.font}`;
    const textWidth = ctx.measureText(settings.text).width;
    drawWatermarkText(
      ctx,
      { ...settings, angle: 0 },
      width - textWidth / 2 - 28,
      height - settings.size - 28,
    );
    return;
  }
  const gapX = Number(settings.gapX || 260);
  const gapY = Number(settings.gapY || 180);
  for (let y = -gapY; y < height + gapY; y += gapY) {
    for (let x = -gapX; x < width + gapX; x += gapX) {
      drawWatermarkText(ctx, settings, x, y);
    }
  }
}

async function renderPdfWatermarkPagePreview() {
  const ctx = await renderPdfPreviewPageBase();
  if (!ctx) return;
  drawCanvasWatermarkOverlay(ctx, readWatermarkSettings(), watermarkCanvas.width, watermarkCanvas.height);
  updatePdfPreviewPlaceholder();
}

async function renderPdfRedactionPagePreview() {
  const ctx = await renderPdfPreviewPageBase();
  if (!ctx) return;
  pdfRedactionPageSnapshot = ctx.getImageData(0, 0, watermarkCanvas.width, watermarkCanvas.height);
  redrawPdfRedactionOverlays();
  updatePdfPreviewPlaceholder();
}

function redrawPdfRedactionOverlays() {
  if (!watermarkCanvas || !lastPdfPageLayout || !pdfRedactionPageSnapshot) return;
  const ctx = watermarkCanvas.getContext("2d");
  ctx.putImageData(pdfRedactionPageSnapshot, 0, 0);
  pdfRedactions
    .filter((redaction) => redaction.page === pdfRedactionCurrentPage)
    .forEach((redaction) => drawPdfRedactionOverlay(ctx, redaction, lastPdfPageLayout, "saved"));
  if (pdfRedactionDraftRegion) {
    drawPdfRedactionOverlay(ctx, pdfRedactionDraftRegion, lastPdfPageLayout, "draft");
  }
}


async function renderPdfBytesToCanvas(pdfBytes, pageNumber, canvas) {
  if (!pdfBytes || !canvas || !ensurePdfJsWorker()) return;
  const loadingTask = window.pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageNumber);
  const scale = getPdfRedactionRenderScale(page);
  const viewport = page.getViewport({ scale });
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  await pdfDoc.destroy();
}


async function buildProcessedPdfBytes() {
  if (!watermarkPdfBytes || !window.PDFLib) return null;
  const { PDFDocument } = window.PDFLib;
  const pdfDoc = await PDFDocument.load(watermarkPdfBytes);
  pdfPageCount = pdfDoc.getPageCount();

  if (activePdfTool === "watermark") {
    const settings = readWatermarkSettings();
    const watermarkImageData = createWatermarkPng(settings);
    const watermarkPng = await pdfDoc.embedPng(watermarkImageData.dataUrl);
    pdfDoc.getPages().forEach((page) => {
      drawPdfWatermarkOnPage(page, watermarkPng, watermarkImageData, settings);
    });
  }

  if (activePdfTool === "redaction") {
    await applyPdfRedactionsToDocument(pdfDoc);
  }

  return pdfDoc.save();
}

async function renderPdfJsPageToCanvas(pdfJsDoc, pageNumber, scale = 2) {
  const page = await pdfJsDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

function getPdfRedactionPdfCoords(page, redaction) {
  const { width, height } = page.getSize();
  return {
    x: (width * redaction.x) / 100,
    y: height - (height * (redaction.y + redaction.height)) / 100,
    width: (width * redaction.width) / 100,
    height: (height * redaction.height) / 100,
  };
}

function applySolidRedactionOnPdfPage(page, redaction) {
  const { rgb } = window.PDFLib;
  const coords = getPdfRedactionPdfCoords(page, redaction);
  const { r, g, b } = hexToRgb(redaction.color || "#111827");
  const opacity = getPdfRedactionOpacity(redaction);
  page.drawRectangle({
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
    color: rgb(r / 255, g / 255, b / 255),
    opacity,
  });
}

async function applyMosaicRedactionOnPdfPage(page, redaction, pageCanvas, pdfDoc) {
  const coords = getPdfRedactionPdfCoords(page, redaction);
  const canvasW = pageCanvas.width;
  const canvasH = pageCanvas.height;
  const sx = clampNumber(Math.floor((redaction.x / 100) * canvasW), 0, Math.max(0, canvasW - 1));
  const sy = clampNumber(Math.floor((redaction.y / 100) * canvasH), 0, Math.max(0, canvasH - 1));
  const sw = Math.max(1, Math.min(canvasW - sx, Math.ceil((redaction.width / 100) * canvasW)));
  const sh = Math.max(1, Math.min(canvasH - sy, Math.ceil((redaction.height / 100) * canvasH)));

  const patch = document.createElement("canvas");
  patch.width = sw;
  patch.height = sh;
  const patchCtx = patch.getContext("2d");
  patchCtx.drawImage(pageCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
  drawMosaicRegion(patchCtx, patch, { x: 0, y: 0, width: sw, height: sh }, redaction.blockSize || 18, 1);

  const png = await pdfDoc.embedPng(patch.toDataURL("image/png"));
  page.drawImage(png, {
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
  });
}

async function applyPdfRedactionsToDocument(pdfDoc) {
  const pageCount = pdfDoc.getPageCount();
  const hasMosaic = pdfRedactions.some((redaction) => redaction.type === "mosaic");
  const pdfJsDoc = hasMosaic && ensurePdfJsWorker() ? await getPdfJsDocument() : null;
  const pageCanvasCache = new Map();

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdfDoc.getPage(pageIndex);
    const redactions = pdfRedactions.filter((redaction) => redaction.page === pageIndex + 1);
    if (!redactions.length) continue;

    const pageNeedsMosaic = redactions.some((redaction) => redaction.type === "mosaic");
    if (pageNeedsMosaic && pdfJsDoc) {
      pageCanvasCache.set(pageIndex + 1, await renderPdfJsPageToCanvas(pdfJsDoc, pageIndex + 1, 2));
    }

    for (const redaction of redactions) {
      if (redaction.type === "mosaic" && pageCanvasCache.has(pageIndex + 1)) {
        await applyMosaicRedactionOnPdfPage(page, redaction, pageCanvasCache.get(pageIndex + 1), pdfDoc);
      } else {
        applySolidRedactionOnPdfPage(page, redaction);
      }
    }
  }
}


function getPdfRedactionCanvasPoint(event) {
  const rect = watermarkCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * watermarkCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * watermarkCanvas.height,
  };
}

function createPdfRedactionDraftFromPoint(point) {
  if (!pdfRedactionStartPoint || !lastPdfPageLayout || !point) return null;
  return canvasRectToPercentRedaction(
    {
      x: pdfRedactionStartPoint.x,
      y: pdfRedactionStartPoint.y,
      width: point.x - pdfRedactionStartPoint.x,
      height: point.y - pdfRedactionStartPoint.y,
    },
    lastPdfPageLayout,
  );
}

function handlePdfRedactionPointerDown(event) {
  if (activePdfTool !== "redaction" || !watermarkPdfBytes) return;
  if (!lastPdfPageLayout) {
    watermarkStatus.textContent = "预览加载中，请稍候再框选。";
    return;
  }
  event.preventDefault();
  watermarkCanvas.setPointerCapture(event.pointerId);
  isDrawingPdfRedaction = true;
  pdfRedactionStartPoint = getPdfRedactionCanvasPoint(event);
  const redactionSettings = readPdfRedactionSettings();
  pdfRedactionDraftRegion = {
    page: pdfRedactionCurrentPage,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: redactionSettings.type,
    color: redactionSettings.color,
    blockSize: redactionSettings.blockSize,
    opacity: redactionSettings.opacity,
  };
}

function handlePdfRedactionPointerMove(event) {
  if (!isDrawingPdfRedaction || !pdfRedactionStartPoint || !lastPdfPageLayout) return;
  event.preventDefault();
  pdfRedactionDraftRegion = createPdfRedactionDraftFromPoint(getPdfRedactionCanvasPoint(event));
  redrawPdfRedactionOverlays();
}

function finishPdfRedactionRegion(event) {
  if (!isDrawingPdfRedaction) return;
  event.preventDefault();
  const draft =
    createPdfRedactionDraftFromPoint(getPdfRedactionCanvasPoint(event)) || pdfRedactionDraftRegion;
  try {
    if (watermarkCanvas.hasPointerCapture(event.pointerId)) {
      watermarkCanvas.releasePointerCapture(event.pointerId);
    }
  } catch {
    /* ignore */
  }
  isDrawingPdfRedaction = false;
  pdfRedactionStartPoint = null;
  pdfRedactionDraftRegion = null;
  if (draft && addPdfRedaction(draft)) {
    void drawWatermarkPreview();
    return;
  }
  redrawPdfRedactionOverlays();
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function saveImageMosaicSettings() {
  imageMosaicSettings = readImageMosaicSettings();
  await apiRequest("/tool-settings", {
    method: "POST",
    body: JSON.stringify({
      tool: IMAGE_PROCESSING_TOOL_KEY,
      settings: imageMosaicSettings,
    }),
  });
}

function renderImageMosaicSettings() {
  updateImageSliderLabels();
  imageMosaicBlockInput.value = imageMosaicSettings.blockSize;
  imageMosaicFormatInput.value = imageMosaicSettings.format || "png";
  imageCropAspectInput.value = imageMosaicSettings.cropAspect || "free";
  imageResizeWidthInput.value = imageMosaicSettings.resizeWidth || "";
  imageResizeHeightInput.value = imageMosaicSettings.resizeHeight || "";
  imageKeepRatioInput.checked = imageMosaicSettings.keepRatio !== false;
  imageQualityInput.value = imageMosaicSettings.quality ?? 0.82;
  imageBackgroundColorInput.value = imageMosaicSettings.backgroundColor || "#ffffff";
  if (imageFormatQualityInput) {
    imageFormatQualityInput.value = imageMosaicSettings.quality ?? 0.82;
  }
  if (imageFormatBackgroundInput) {
    imageFormatBackgroundInput.value = imageMosaicSettings.backgroundColor || "#ffffff";
  }
  imageWatermarkTextInput.value = imageMosaicSettings.watermarkText || "仅供本人使用";
  imageWatermarkModeInput.value = imageMosaicSettings.watermarkMode || "repeat";
  imageWatermarkSizeInput.value = imageMosaicSettings.watermarkSize || 36;
  imageWatermarkColorInput.value = imageMosaicSettings.watermarkColor || "#0f7f72";
  imageWatermarkOpacityInput.value = imageMosaicSettings.watermarkOpacity ?? 0.22;
  imageWatermarkAngleInput.value = imageMosaicSettings.watermarkAngle ?? -28;
  imageBrightnessInput.value = imageMosaicSettings.brightness || 100;
  imageContrastInput.value = imageMosaicSettings.contrast || 100;
  imageSaturationInput.value = imageMosaicSettings.saturation || 100;
  imageGrayscaleInput.checked = Boolean(imageMosaicSettings.grayscale);
  imageRotationInput.value = String(imageMosaicSettings.rotation || 0);
  imageFlipHorizontalInput.checked = Boolean(imageMosaicSettings.flipHorizontal);
  imageFlipVerticalInput.checked = Boolean(imageMosaicSettings.flipVertical);
  updateImageFormatParamVisibility();
}

function readImageMosaicSettings() {
  const width = imageResizeWidthInput.value ? clampNumber(Number(imageResizeWidthInput.value), 1, 12000) : "";
  const height = imageResizeHeightInput.value ? clampNumber(Number(imageResizeHeightInput.value), 1, 12000) : "";
  const qualitySource =
    activeImageEditTool === "format" && imageFormatQualityInput
      ? imageFormatQualityInput
      : imageQualityInput;
  const backgroundSource =
    activeImageEditTool === "format" && imageFormatBackgroundInput
      ? imageFormatBackgroundInput
      : imageBackgroundColorInput;
  return {
    blockSize: clampNumber(Number(imageMosaicBlockInput.value || 18), 4, 72),
    format: ["jpeg", "webp", "pdf"].includes(imageMosaicFormatInput?.value)
      ? imageMosaicFormatInput.value
      : "png",
    cropAspect: imageCropAspectInput.value || "free",
    resizeEnabled: activeImageEditTool === "resize",
    resizeWidth: width,
    resizeHeight: height,
    keepRatio: imageKeepRatioInput.checked,
    quality: clampNumber(Number(qualitySource?.value || 0.82), 0.1, 1),
    backgroundColor: backgroundSource?.value || "#ffffff",
    watermarkText: imageWatermarkTextInput.value.trim() || "仅供本人使用",
    watermarkMode: imageWatermarkModeInput.value || "repeat",
    watermarkSize: clampNumber(Number(imageWatermarkSizeInput.value || 36), 12, 160),
    watermarkColor: imageWatermarkColorInput.value || "#0f7f72",
    watermarkOpacity: clampNumber(Number(imageWatermarkOpacityInput.value || 0.22), 0.05, 1),
    watermarkAngle: clampNumber(Number(imageWatermarkAngleInput.value || -28), -90, 90),
    brightness: clampNumber(Number(imageBrightnessInput.value || 100), 30, 180),
    contrast: clampNumber(Number(imageContrastInput.value || 100), 30, 180),
    saturation: clampNumber(Number(imageSaturationInput.value || 100), 0, 220),
    grayscale: imageGrayscaleInput.checked,
    rotation: Number(imageRotationInput.value || 0),
    flipHorizontal: imageFlipHorizontalInput.checked,
    flipVertical: imageFlipVerticalInput.checked,
  };
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function revokeWatermarkOutputUrl() {
  if (watermarkOutputUrl) {
    URL.revokeObjectURL(watermarkOutputUrl);
    watermarkOutputUrl = "";
  }
  watermarkPdfPreview.src = "";
}

function showWatermarkPreview(type) {
  watermarkCanvas.classList.toggle("hidden", type === "pdf");
  watermarkPdfPreview.classList.toggle("hidden", type !== "pdf");
  updatePdfPreviewPlaceholder();
}

function drawWatermarkText(ctx, settings, x, y) {
  const { r, g, b } = hexToRgb(settings.color);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((settings.angle * Math.PI) / 180);
  ctx.font = `900 ${settings.size}px ${settings.font}`;
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${settings.opacity})`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(settings.text, 0, 0);
  ctx.restore();
}

function drawImageWatermarkPreview() {
  const ctx = watermarkCanvas.getContext("2d");
  const settings = readWatermarkSettings();
  showWatermarkPreview("image");

  if (!watermarkImage) {
    watermarkCanvas.width = 900;
    watermarkCanvas.height = 520;
    ctx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
    watermarkStatus.textContent = "选择 PDF 后生成预览。";
    pdfPageCount = 0;
    updatePdfMeta();
    updatePdfPreviewPlaceholder();
    return;
  }

  watermarkCanvas.width = watermarkImage.naturalWidth;
  watermarkCanvas.height = watermarkImage.naturalHeight;
  ctx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
  ctx.drawImage(watermarkImage, 0, 0);

  if (settings.mode === "center") {
    drawWatermarkText(ctx, settings, watermarkCanvas.width / 2, watermarkCanvas.height / 2);
  } else if (settings.mode === "bottomRight") {
    ctx.font = `900 ${settings.size}px ${settings.font}`;
    const textWidth = ctx.measureText(settings.text).width;
    drawWatermarkText(
      ctx,
      { ...settings, angle: 0 },
      watermarkCanvas.width - textWidth / 2 - 28,
      watermarkCanvas.height - settings.size - 28,
    );
  } else {
    for (let y = -settings.gapY; y < watermarkCanvas.height + settings.gapY; y += settings.gapY) {
      for (let x = -settings.gapX; x < watermarkCanvas.width + settings.gapX; x += settings.gapX) {
        drawWatermarkText(ctx, settings, x, y);
      }
    }
  }

  watermarkStatus.textContent = `${watermarkImage.naturalWidth} x ${watermarkImage.naturalHeight}，本地生成，不上传原图。`;
}

function createWatermarkPng(settings) {
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  const size = Number(settings.size || 36);
  const text = settings.text || "仅供本人使用";
  measureCtx.font = `900 ${size}px ${settings.font}`;
  const textWidth = Math.ceil(measureCtx.measureText(text).width);
  const padding = Math.max(24, Math.ceil(size * 0.7));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(80, textWidth + padding * 2);
  canvas.height = Math.max(48, Math.ceil(size * 1.8) + padding);

  const ctx = canvas.getContext("2d");
  const { r, g, b } = hexToRgb(settings.color);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `900 ${size}px ${settings.font}`;
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${settings.opacity})`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

function drawPdfWatermarkOnPage(page, watermarkPng, imageSize, settings) {
  const { degrees } = window.PDFLib;
  const { width, height } = page.getSize();
  const imageWidth = imageSize.width;
  const imageHeight = imageSize.height;
  const drawImage = (x, y, angle = settings.angle) => {
    page.drawImage(watermarkPng, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
      rotate: degrees(Number(angle || 0)),
    });
  };

  if (settings.mode === "center") {
    drawImage((width - imageWidth) / 2, (height - imageHeight) / 2, settings.angle);
    return;
  }

  if (settings.mode === "bottomRight") {
    drawImage(Math.max(28, width - imageWidth - 28), 28, 0);
    return;
  }

  const gapX = Number(settings.gapX || 260);
  const gapY = Number(settings.gapY || 180);
  for (let y = -gapY; y < height + gapY; y += gapY) {
    for (let x = -gapX; x < width + gapX; x += gapX) {
      drawImage(x, y, settings.angle);
    }
  }
}

async function drawPdfWatermarkPreview() {
  if (!watermarkPdfBytes) {
    pdfPageCount = 0;
    pdfRedactionPageSnapshot = null;
    updatePdfMeta();
    updatePdfPreviewPlaceholder();
    return;
  }

  if (!window.PDFLib) {
    watermarkStatus.textContent = "PDF 处理需要加载 pdf-lib，请强制刷新页面后重试。";
    return;
  }

  if (!ensurePdfJsWorker()) {
    watermarkStatus.textContent = "PDF 预览需要加载 pdf.js，请强制刷新页面后重试。";
    return;
  }

  const bytes = await buildProcessedPdfBytes();
  if (bytes) {
    revokeWatermarkOutputUrl();
    watermarkOutputUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  }

  if (activePdfTool === "watermark") {
    await renderPdfWatermarkPagePreview();
    watermarkStatus.textContent = `PDF 共 ${pdfPageCount} 页，第 ${pdfRedactionCurrentPage} 页水印预览，本地处理不上传文件。`;
  } else {
    await renderPdfRedactionPagePreview();
    if (pdfRedactions.length) {
      watermarkStatus.textContent =
        `PDF 共 ${pdfPageCount} 页，已标记 ${pdfRedactions.length} 个打码区域，可继续拖拽添加。`;
    } else {
      watermarkStatus.textContent =
        `PDF 共 ${pdfPageCount} 页，在预览区拖拽框选打码区域。`;
    }
  }

  updatePdfMeta();
  updatePdfPreviewPlaceholder();
}

async function drawWatermarkPreview() {
  if (watermarkFileType === "pdf") {
    await drawPdfWatermarkPreview();
  } else {
    revokeWatermarkOutputUrl();
    drawImageWatermarkPreview();
  }
}

function getCropAspectRatio() {
  const value = imageCropAspectInput.value || "free";
  if (value === "1:1") return 1;
  if (value === "4:3") return 4 / 3;
  if (value === "16:9") return 16 / 9;
  if (value === "3:4") return 3 / 4;
  return null;
}

function normalizeRegion(region, maxWidth, maxHeight, minSize = 6) {
  if (!region || !maxWidth || !maxHeight) return null;
  const x = clampNumber(Math.min(region.x, region.x + region.width), 0, maxWidth);
  const y = clampNumber(Math.min(region.y, region.y + region.height), 0, maxHeight);
  const right = clampNumber(Math.max(region.x, region.x + region.width), 0, maxWidth);
  const bottom = clampNumber(Math.max(region.y, region.y + region.height), 0, maxHeight);
  const width = right - x;
  const height = bottom - y;
  if (width < minSize || height < minSize) return null;
  return { x, y, width, height };
}

function normalizeMosaicRegion(region, width = imageMosaicCanvas.width, height = imageMosaicCanvas.height) {
  return normalizeRegion(region, width, height);
}

function constrainRegionToAspect(startPoint, point, aspect, maxWidth, maxHeight) {
  if (!aspect) return point;
  const directionX = point.x >= startPoint.x ? 1 : -1;
  const directionY = point.y >= startPoint.y ? 1 : -1;
  let width = Math.abs(point.x - startPoint.x);
  let height = width / aspect;
  if (height > Math.abs(point.y - startPoint.y)) {
    height = Math.abs(point.y - startPoint.y);
    width = height * aspect;
  }
  return {
    x: clampNumber(startPoint.x + width * directionX, 0, maxWidth),
    y: clampNumber(startPoint.y + height * directionY, 0, maxHeight),
  };
}

function intersectRegions(region, clip) {
  const x = Math.max(region.x, clip.x);
  const y = Math.max(region.y, clip.y);
  const right = Math.min(region.x + region.width, clip.x + clip.width);
  const bottom = Math.min(region.y + region.height, clip.y + clip.height);
  if (right <= x || bottom <= y) return null;
  return { x, y, width: right - x, height: bottom - y };
}

function getImageToolEffectFlags(tool = activeImageEditTool, options = {}) {
  const exporting = Boolean(options.exporting || options.forceApplyCrop);
  return {
    applyTune: tool === "tune",
    applyMosaic: tool === "mosaic",
    applyWatermark: tool === "watermark",
    applyCrop: tool === "crop" && exporting,
    showCropGuide: tool === "crop" && !exporting,
    applyResize: tool === "resize",
  };
}

function getImageExportFormatAndQuality(tool, settings) {
  if (tool === "compress") {
    return { format: "jpeg", quality: settings.quality };
  }
  if (tool === "format") {
    return { format: settings.format, quality: settings.quality };
  }
  return { format: "png", quality: settings.quality };
}

function isRasterImageExportFormat(format) {
  return format === "jpeg" || format === "webp";
}

function updateImageFormatParamVisibility() {
  const format = imageMosaicFormatInput?.value || "png";
  const isPdf = format === "pdf";
  const needsBackground = isRasterImageExportFormat(format);
  imageFormatQualityField?.classList.toggle("hidden", isPdf);
  imageFormatBackgroundField?.classList.toggle("hidden", !needsBackground);
  imageFormatRasterHint?.classList.toggle("hidden", isPdf);
  imageFormatPdfHint?.classList.toggle("hidden", !isPdf);
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function buildImagePdfBytes(canvas, settings = {}) {
  const { PDFDocument } = window.PDFLib;
  if (!PDFDocument) {
    throw new Error("PDF 处理库未加载，请确认网络可访问 CDN 后刷新页面。");
  }
  const width = Math.max(1, Math.round(canvas.width));
  const height = Math.max(1, Math.round(canvas.height));
  const pdfDoc = await PDFDocument.create();
  const quality = clampNumber(Number(settings.quality ?? 0.92), 0.1, 1);
  const flatCanvas = document.createElement("canvas");
  flatCanvas.width = width;
  flatCanvas.height = height;
  const flatCtx = flatCanvas.getContext("2d");
  flatCtx.fillStyle = settings.backgroundColor || "#ffffff";
  flatCtx.fillRect(0, 0, width, height);
  flatCtx.drawImage(canvas, 0, 0, width, height);
  const jpegBytes = dataUrlToUint8Array(flatCanvas.toDataURL("image/jpeg", quality));
  const embeddedImage = await pdfDoc.embedJpg(jpegBytes);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width,
    height,
  });
  return pdfDoc.save();
}

function createEditedImageBaseCanvas(settings, { applyTune = false } = {}) {
  const rotation = Number(settings.rotation || 0);
  const isSideways = rotation === 90 || rotation === 270;
  const outputWidth = isSideways ? imageMosaicSource.naturalHeight : imageMosaicSource.naturalWidth;
  const outputHeight = isSideways ? imageMosaicSource.naturalWidth : imageMosaicSource.naturalHeight;
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = outputWidth;
  baseCanvas.height = outputHeight;
  const ctx = baseCanvas.getContext("2d");
  ctx.clearRect(0, 0, outputWidth, outputHeight);
  ctx.save();
  const filters = [];
  if (applyTune) {
    filters.push(
      `brightness(${settings.brightness}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
    );
    if (settings.grayscale) filters.push("grayscale(100%)");
  }
  ctx.filter = filters.length ? filters.join(" ") : "none";
  ctx.translate(outputWidth / 2, outputHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(settings.flipHorizontal ? -1 : 1, settings.flipVertical ? -1 : 1);
  ctx.drawImage(imageMosaicSource, -imageMosaicSource.naturalWidth / 2, -imageMosaicSource.naturalHeight / 2);
  ctx.restore();
  return baseCanvas;
}

function getEffectiveCrop(baseCanvas, shouldApplyCrop) {
  if (!shouldApplyCrop || !imageCropRegion) return null;
  return normalizeRegion(imageCropRegion, baseCanvas.width, baseCanvas.height);
}

function getResizeDimensions(sourceWidth, sourceHeight, settings, shouldApplyResize = true) {
  if (!shouldApplyResize || !settings.resizeEnabled) {
    return { width: sourceWidth, height: sourceHeight };
  }
  let width = Number(settings.resizeWidth || 0);
  let height = Number(settings.resizeHeight || 0);
  if (!width && !height) return { width: sourceWidth, height: sourceHeight };
  if (settings.keepRatio) {
    const ratio = sourceWidth / sourceHeight;
    if (width && !height) height = Math.round(width / ratio);
    else if (!width && height) width = Math.round(height * ratio);
    else if (width && height) height = Math.round(width / ratio);
  }
  return {
    width: Math.round(clampNumber(width || sourceWidth, 1, 12000)),
    height: Math.round(clampNumber(height || sourceHeight, 1, 12000)),
  };
}

function drawMosaicRegion(ctx, sourceCanvas, region, blockSize, minSize = 1) {
  const normalized = normalizeRegion(region, sourceCanvas.width, sourceCanvas.height, minSize);
  if (!normalized) return;

  const sx = Math.round(normalized.x);
  const sy = Math.round(normalized.y);
  const sw = Math.round(normalized.width);
  const sh = Math.round(normalized.height);
  const safeBlockSize = Math.max(1, Number(blockSize) || 1);
  const sampleWidth = Math.max(1, Math.ceil(sw / safeBlockSize));
  const sampleHeight = Math.max(1, Math.ceil(sh / safeBlockSize));
  const mosaicCanvas = document.createElement("canvas");
  mosaicCanvas.width = sampleWidth;
  mosaicCanvas.height = sampleHeight;
  const mosaicCtx = mosaicCanvas.getContext("2d");
  mosaicCtx.imageSmoothingEnabled = false;
  mosaicCtx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sampleWidth, sampleHeight);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(mosaicCanvas, 0, 0, sampleWidth, sampleHeight, sx, sy, sw, sh);
  ctx.restore();
}

function mapBaseRegionToCanvasRegion(region, layout) {
  if (!region || !layout) return null;
  const clip = layout.cropApplied
    ? layout.crop
    : { x: 0, y: 0, width: layout.baseWidth, height: layout.baseHeight };
  const visible = intersectRegions(region, clip);
  if (!visible) return null;
  const scaleX = layout.outputWidth / clip.width;
  const scaleY = layout.outputHeight / clip.height;
  return {
    x: (visible.x - clip.x) * scaleX,
    y: (visible.y - clip.y) * scaleY,
    width: visible.width * scaleX,
    height: visible.height * scaleY,
  };
}

function drawImageRegionOverlay(ctx, region, layout, variant = "mosaic") {
  const displayRegion = mapBaseRegionToCanvasRegion(region, layout);
  if (!displayRegion) return;
  ctx.save();
  ctx.fillStyle = variant === "crop" ? "rgba(2, 6, 23, 0.08)" : "rgba(37, 99, 235, 0.14)";
  ctx.strokeStyle = variant === "crop" ? "#020617" : "#2563eb";
  ctx.lineWidth = Math.max(2, Math.round(imageMosaicCanvas.width / 520));
  ctx.setLineDash(variant === "crop" ? [14, 8] : [10, 8]);
  ctx.fillRect(displayRegion.x, displayRegion.y, displayRegion.width, displayRegion.height);
  ctx.strokeRect(displayRegion.x, displayRegion.y, displayRegion.width, displayRegion.height);
  ctx.restore();
}

function getImageWatermarkSettings(settings) {
  return {
    text: settings.watermarkText || "仅供本人使用",
    font: "\"Noto Sans SC\", \"Source Han Sans SC\", sans-serif",
    size: settings.watermarkSize || 36,
    color: settings.watermarkColor || "#0f7f72",
    opacity: settings.watermarkOpacity ?? 0.22,
    angle: settings.watermarkAngle ?? -28,
    gapX: Math.max(160, Number(settings.watermarkSize || 36) * 7),
    gapY: Math.max(120, Number(settings.watermarkSize || 36) * 5),
    mode: settings.watermarkMode || "repeat",
  };
}

function drawImageWatermarkOnCanvas(ctx, settings, canvas = imageMosaicCanvas) {
  const watermark = getImageWatermarkSettings(settings);
  const { width, height } = canvas;
  if (watermark.mode === "center") {
    drawWatermarkText(ctx, watermark, width / 2, height / 2);
    return;
  }
  if (watermark.mode === "bottomRight") {
    ctx.font = `900 ${watermark.size}px ${watermark.font}`;
    const textWidth = ctx.measureText(watermark.text).width;
    drawWatermarkText(ctx, { ...watermark, angle: 0 }, width - textWidth / 2 - 28, height - watermark.size - 28);
    return;
  }
  for (let y = -watermark.gapY; y < height + watermark.gapY; y += watermark.gapY) {
    for (let x = -watermark.gapX; x < width + watermark.gapX; x += watermark.gapX) {
      drawWatermarkText(ctx, watermark, x, y);
    }
  }
}

function getImageProcessingSummary(settings, layout, tool = activeImageEditTool) {
  if (!imageMosaicSource || !layout) return "等待上传图片";
  switch (tool) {
    case "crop":
      return imageCropRegion ? "已框选裁剪区域，导出时应用裁剪" : "在预览区拖拽框选裁剪范围";
    case "resize":
      return `目标尺寸 ${layout.exportWidth} x ${layout.exportHeight} px`;
    case "compress":
      return `JPG 质量 ${Math.round((settings.quality || 0.82) * 100)}%`;
    case "format": {
      if (settings.format === "pdf") return "导出 PDF 文档";
      const label = settings.format === "jpeg" ? "JPG" : settings.format.toUpperCase();
      return `导出 ${label}，质量 ${Math.round((settings.quality || 0.82) * 100)}%`;
    }
    case "tune":
      return settings.grayscale ? "已应用调色 / 黑白化" : "已应用亮度与色彩调整";
    case "watermark":
      return `水印：${settings.watermarkText || "仅供本人使用"}`;
    case "mosaic":
      return imageMosaicRegions.length
        ? `已标记 ${imageMosaicRegions.length} 个打码区域`
        : "在预览区拖拽添加打码区域";
    default:
      return "等待上传图片";
  }
}

function formatToneOffset(value) {
  const offset = Math.round(Number(value || 100) - 100);
  return offset > 0 ? `+${offset}` : String(offset);
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (!size || size <= 0) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function estimateCanvasJpegBytes(canvas, quality = 0.82) {
  if (!canvas?.width || !canvas?.height) return 0;
  const dataUrl = canvas.toDataURL("image/jpeg", clampNumber(Number(quality), 0.1, 1));
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function updateImageCompressSizeDisplay(settings, layout) {
  const resetLabels = () => {
    if (imageCompressOriginalSizeLabel) imageCompressOriginalSizeLabel.textContent = "--";
    if (imageCompressResultSizeLabel) imageCompressResultSizeLabel.textContent = "--";
    if (imageCompressRatioHint) imageCompressRatioHint.textContent = "上传图片后显示体积对比";
  };

  if (activeImageEditTool !== "compress" || !imageMosaicSource || !layout) {
    resetLabels();
    return;
  }

  const originalBytes = imageOriginalFileSize || 0;
  const exportCanvas = document.createElement("canvas");
  renderProcessedImageCanvas(exportCanvas, {
    tool: "compress",
    exporting: true,
    showGuides: false,
  });
  const estimatedBytes = estimateCanvasJpegBytes(exportCanvas, settings.quality ?? 0.82);

  if (imageCompressOriginalSizeLabel) {
    imageCompressOriginalSizeLabel.textContent = formatFileSize(originalBytes);
  }
  if (imageCompressResultSizeLabel) {
    imageCompressResultSizeLabel.textContent = formatFileSize(estimatedBytes);
  }
  if (imageCompressRatioHint) {
    if (!originalBytes || !estimatedBytes) {
      imageCompressRatioHint.textContent = "上传图片后显示体积对比";
      return;
    }
    const savedRatio = (1 - estimatedBytes / originalBytes) * 100;
    if (savedRatio > 0.5) {
      imageCompressRatioHint.textContent = `约减小 ${savedRatio.toFixed(1)}%（按当前质量导出 JPG 估算）`;
    } else if (savedRatio < -0.5) {
      imageCompressRatioHint.textContent = `预估体积增加 ${Math.abs(savedRatio).toFixed(1)}%（原图可能已高度压缩）`;
    } else {
      imageCompressRatioHint.textContent = "预估体积与上传文件接近（按当前质量导出 JPG 估算）";
    }
  }
}

function updateImageSliderLabels() {
  const settings = readImageMosaicSettings();
  const qualityLabel = `${Math.round((settings.quality || 0.82) * 100)}%`;
  if (imageQualityValue) {
    imageQualityValue.textContent = qualityLabel;
  }
  if (imageFormatQualityValue) {
    imageFormatQualityValue.textContent = qualityLabel;
  }
  if (imageBrightnessValue) {
    imageBrightnessValue.textContent = formatToneOffset(settings.brightness);
  }
  if (imageContrastValue) {
    imageContrastValue.textContent = formatToneOffset(settings.contrast);
  }
  const saturationValue = document.querySelector("#imageSaturationValue");
  if (saturationValue) {
    saturationValue.textContent = `${settings.saturation || 100}%`;
  }
  const mosaicBlockValue = document.querySelector("#imageMosaicBlockValue");
  if (mosaicBlockValue) {
    mosaicBlockValue.textContent = String(settings.blockSize || 18);
  }
}

function snapshotImageEditState() {
  return {
    crop: imageCropRegion ? { ...imageCropRegion } : null,
    regions: imageMosaicRegions.map((region) => ({ ...region })),
  };
}

function applyImageEditState(state) {
  imageCropRegion = state?.crop ? { ...state.crop } : null;
  imageMosaicRegions = Array.isArray(state?.regions) ? state.regions.map((region) => ({ ...region })) : [];
  syncImageResizeInputsToSource(true);
}

function updateUndoRedoButtons() {
  if (!imageUndoButton || !imageRedoButton) return;
  imageUndoButton.disabled = imageEditHistoryIndex <= 0;
  imageRedoButton.disabled = imageEditHistoryIndex >= imageEditHistory.length - 1;
}

function resetImageEditHistory() {
  imageEditHistory = [snapshotImageEditState()];
  imageEditHistoryIndex = 0;
  updateUndoRedoButtons();
}

function pushImageEditHistory() {
  const snapshot = snapshotImageEditState();
  const current = imageEditHistory[imageEditHistoryIndex];
  const unchanged =
    JSON.stringify(current) === JSON.stringify(snapshot);
  if (unchanged) {
    updateUndoRedoButtons();
    return;
  }
  imageEditHistory = imageEditHistory.slice(0, imageEditHistoryIndex + 1);
  imageEditHistory.push(snapshot);
  imageEditHistoryIndex = imageEditHistory.length - 1;
  updateUndoRedoButtons();
}

function undoImageEdit() {
  if (imageEditHistoryIndex <= 0) return;
  imageEditHistoryIndex -= 1;
  applyImageEditState(imageEditHistory[imageEditHistoryIndex]);
  updateUndoRedoButtons();
  drawImageMosaicPreview();
}

function redoImageEdit() {
  if (imageEditHistoryIndex >= imageEditHistory.length - 1) return;
  imageEditHistoryIndex += 1;
  applyImageEditState(imageEditHistory[imageEditHistoryIndex]);
  updateUndoRedoButtons();
  drawImageMosaicPreview();
}

function updateImageFileLabel(name = "") {
  currentImageFileLabel = name;
  if (imageFileNameLabel) {
    imageFileNameLabel.textContent = name || "未选择文件";
  }
}

function updateImagePreviewPlaceholder() {
  imagePreviewPlaceholder?.classList.toggle("hidden", Boolean(imageMosaicSource));
}

function updateImageMosaicStatus(settings, layout) {
  if (imageMosaicRegionCount) {
    imageMosaicRegionCount.textContent = `${imageMosaicRegions.length} 个区域`;
  }
  if (!imageMosaicSource || !layout) {
    imageMosaicStatus.textContent = "选择图片后生成预览。";
    imageOriginalSizeLabel.textContent = "--";
    imageProcessingSummary.textContent = "等待上传图片";
    updateImageCompressSizeDisplay(settings, null);
    return;
  }

  imageOriginalSizeLabel.textContent = `${imageMosaicSource.naturalWidth} x ${imageMosaicSource.naturalHeight} px`;
  imageProcessingSummary.textContent = getImageProcessingSummary(settings, layout, activeImageEditTool);
  updateImageCompressSizeDisplay(settings, layout);

  if (imageMosaicStatus) {
    const showHint = imageMosaicSource && ["crop", "mosaic"].includes(activeImageEditTool);
    imageMosaicStatus.classList.toggle("hidden", !showHint);
    if (activeImageEditTool === "crop") {
      imageMosaicStatus.textContent = "在预览区拖拽选择裁剪范围，导出时会应用裁剪。";
    } else if (activeImageEditTool === "mosaic") {
      imageMosaicStatus.textContent =
        `在预览区拖拽添加打码区域，已标记 ${imageMosaicRegions.length} 个区域。`;
    }
  }
  imageMosaicCanvas?.classList.toggle("has-image", Boolean(imageMosaicSource));
}

function clearImageUpload() {
  imageMosaicSource = null;
  imageOriginalFileSize = 0;
  imageMosaicRegions = [];
  imageMosaicDraftRegion = null;
  imageCropRegion = null;
  isDrawingMosaic = false;
  imageMosaicStartPoint = null;
  if (imageMosaicInput) {
    imageMosaicInput.value = "";
  }
  imagePreviewZoom = 1;
  updateImageFileLabel("");
  resetImageEditHistory();
  if (imageMosaicStatus) {
    imageMosaicStatus.textContent = "已切换工具，请重新上传图片。";
    imageMosaicStatus.classList.remove("hidden");
  }
  drawImageMosaicPreview();
}

function getImagePreviewFitScale() {
  if (!imageMosaicCanvas?.width) return 1;
  const wrapWidth = imageMosaicCanvasWrap?.clientWidth || IMAGE_PREVIEW_MAX_WIDTH;
  const availableWidth = Math.max(200, wrapWidth - 48);
  return Math.min(2, availableWidth / imageMosaicCanvas.width);
}

function getImagePreviewDisplayScale() {
  return getImagePreviewFitScale() * imagePreviewZoom;
}

function applyImagePreviewDisplayScale() {
  if (!imageMosaicCanvas?.width || !imageMosaicSource) {
    if (imageMosaicCanvas) {
      imageMosaicCanvas.style.width = "";
      imageMosaicCanvas.style.height = "";
    }
    return;
  }
  const scale = getImagePreviewDisplayScale();
  imageMosaicCanvas.style.width = `${Math.round(imageMosaicCanvas.width * scale)}px`;
  imageMosaicCanvas.style.height = `${Math.round(imageMosaicCanvas.height * scale)}px`;
}

function setImagePreviewZoom(nextZoom, options = {}) {
  const clamped = clampNumber(nextZoom, IMAGE_PREVIEW_ZOOM_MIN, IMAGE_PREVIEW_ZOOM_MAX);
  if (!options.force && Math.abs(clamped - imagePreviewZoom) < 0.001) {
    updateImagePreviewChrome();
    return;
  }
  imagePreviewZoom = clamped;
  updateImagePreviewChrome();
  applyImagePreviewDisplayScale();
}

function adjustImagePreviewZoom(multiplier) {
  setImagePreviewZoom(imagePreviewZoom * multiplier);
}

function updateImagePreviewChrome() {
  const hasImage = Boolean(imageMosaicSource);
  const interactive = ["crop", "mosaic"].includes(activeImageEditTool);
  imagePreviewActions?.classList.toggle("hidden", !interactive);
  imageZoomNav?.classList.toggle("hidden", !hasImage);
  imageMosaicCanvas?.classList.toggle(
    "is-selectable",
    interactive && hasImage,
  );
  if (imageZoomLabel) {
    imageZoomLabel.textContent = `${Math.round(imagePreviewZoom * 100)}%`;
  }
  if (imageZoomOutButton) {
    imageZoomOutButton.disabled = imagePreviewZoom <= IMAGE_PREVIEW_ZOOM_MIN + 0.001;
  }
  if (imageZoomInButton) {
    imageZoomInButton.disabled = imagePreviewZoom >= IMAGE_PREVIEW_ZOOM_MAX - 0.001;
  }
  if (imageParamsSubtitle) {
    imageParamsSubtitle.textContent =
      IMAGE_TOOL_SUBTITLES[activeImageEditTool] || IMAGE_TOOL_SUBTITLES.crop;
  }
  if (downloadImageMosaicButton) {
    downloadImageMosaicButton.textContent =
      activeImageEditTool === "format" ? "导出文件" : "导出图片";
  }
}

function setActiveImageTool(tool, options = {}) {
  const nextTool = tool || "crop";
  const toolChanged = nextTool !== activeImageEditTool;
  if (toolChanged && !options.preserveUpload) {
    clearImageUpload();
  }
  activeImageEditTool = nextTool;
  imageToolOptionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.imageTool === activeImageEditTool);
  });
  if (imageEditorParams) {
    imageEditorParams.dataset.activePanel = activeImageEditTool;
  }
  imageProcessingBlocks.forEach((block) => {
    block.classList.toggle("hidden", block.dataset.imagePanel !== activeImageEditTool);
  });
  updateImageFormatParamVisibility();
  updateImagePreviewChrome();
  drawImageMosaicPreview();
}

function getTransformedSourceSize(settings) {
  if (!imageMosaicSource) return { width: 0, height: 0 };
  const rotation = Number(settings.rotation || 0);
  const isSideways = rotation === 90 || rotation === 270;
  return {
    width: isSideways ? imageMosaicSource.naturalHeight : imageMosaicSource.naturalWidth,
    height: isSideways ? imageMosaicSource.naturalWidth : imageMosaicSource.naturalHeight,
  };
}

function getResizeReferenceSize() {
  const settings = readImageMosaicSettings();
  const size = getTransformedSourceSize(settings);
  const crop = imageCropRegion ? normalizeRegion(imageCropRegion, size.width, size.height) : null;
  return crop ? { width: crop.width, height: crop.height } : size;
}

function syncImageResizeInputsToSource(force = false) {
  if (!imageMosaicSource) return;
  const { width, height } = getResizeReferenceSize();
  if (!width || !height) return;
  if (force || !imageResizeWidthInput.value) imageResizeWidthInput.value = Math.round(width);
  if (force || !imageResizeHeightInput.value) imageResizeHeightInput.value = Math.round(height);
}

function syncImageResizeRatio(changedField) {
  if (!imageKeepRatioInput.checked || !imageMosaicSource) return;
  const { width, height } = getResizeReferenceSize();
  if (!width || !height) return;
  const ratio = width / height;
  if (changedField === "width" && imageResizeWidthInput.value) {
    imageResizeHeightInput.value = Math.max(1, Math.round(Number(imageResizeWidthInput.value) / ratio));
  }
  if (changedField === "height" && imageResizeHeightInput.value) {
    imageResizeWidthInput.value = Math.max(1, Math.round(Number(imageResizeHeightInput.value) * ratio));
  }
}

function renderProcessedImageCanvas(targetCanvas, options = {}) {
  const tool = options.tool || activeImageEditTool;
  const settings = readImageMosaicSettings();
  const flags = getImageToolEffectFlags(tool, options);
  const ctx = targetCanvas.getContext("2d");
  const exportMeta = getImageExportFormatAndQuality(tool, settings);
  const fillBackground = options.exporting
    ? isRasterImageExportFormat(exportMeta.format)
    : tool === "format" && isRasterImageExportFormat(settings.format);

  if (!imageMosaicSource) {
    targetCanvas.width = 900;
    targetCanvas.height = 520;
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    lastImageRenderLayout = null;
    return null;
  }

  const baseCanvas = createEditedImageBaseCanvas(settings, { applyTune: flags.applyTune });
  const baseCtx = baseCanvas.getContext("2d");
  if (flags.applyMosaic) {
    imageMosaicRegions.forEach((region) =>
      drawMosaicRegion(baseCtx, baseCanvas, region, settings.blockSize),
    );
  }

  const crop = getEffectiveCrop(baseCanvas, flags.applyCrop);
  const sourceWidth = crop ? crop.width : baseCanvas.width;
  const sourceHeight = crop ? crop.height : baseCanvas.height;
  const resized = getResizeDimensions(sourceWidth, sourceHeight, settings, flags.applyResize);

  targetCanvas.width = resized.width;
  targetCanvas.height = resized.height;
  ctx.clearRect(0, 0, resized.width, resized.height);
  if (fillBackground) {
    ctx.fillStyle = settings.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, resized.width, resized.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    baseCanvas,
    crop ? crop.x : 0,
    crop ? crop.y : 0,
    sourceWidth,
    sourceHeight,
    0,
    0,
    resized.width,
    resized.height,
  );

  if (flags.applyWatermark) {
    drawImageWatermarkOnCanvas(ctx, settings, targetCanvas);
  }

  const layout = {
    baseWidth: baseCanvas.width,
    baseHeight: baseCanvas.height,
    cropApplied: Boolean(crop),
    crop: crop || { x: 0, y: 0, width: baseCanvas.width, height: baseCanvas.height },
    outputWidth: resized.width,
    outputHeight: resized.height,
    exportWidth: resized.width,
    exportHeight: resized.height,
    exportFormat: exportMeta.format,
  };

  if (options.showGuides !== false && flags.showCropGuide) {
    const cropGuide = normalizeRegion(
      imageMosaicDraftRegion || imageCropRegion,
      baseCanvas.width,
      baseCanvas.height,
    );
    if (cropGuide) drawImageRegionOverlay(ctx, cropGuide, layout, "crop");
  } else if (options.showGuides !== false && flags.applyMosaic && imageMosaicDraftRegion) {
    drawImageRegionOverlay(ctx, imageMosaicDraftRegion, layout, "mosaic");
  }

  return layout;
}

function drawImageMosaicPreview(options = {}) {
  const settings = readImageMosaicSettings();

  updateImagePreviewPlaceholder();
  updateImageSliderLabels();

  if (!imageMosaicSource) {
    lastImageRenderLayout = null;
    updateImageMosaicStatus(settings, null);
    renderProcessedImageCanvas(imageMosaicCanvas, options);
    updateImagePreviewChrome();
    return;
  }

  lastImageRenderLayout = renderProcessedImageCanvas(imageMosaicCanvas, options);
  applyImagePreviewDisplayScale();
  updateImagePreviewChrome();
  updateImageMosaicStatus(settings, lastImageRenderLayout);
}

function getImageMosaicCanvasPoint(event) {
  const rect = imageMosaicCanvas.getBoundingClientRect();
  const canvasX = ((event.clientX - rect.left) / rect.width) * imageMosaicCanvas.width;
  const canvasY = ((event.clientY - rect.top) / rect.height) * imageMosaicCanvas.height;
  const layout = lastImageRenderLayout;
  if (!layout) return { x: 0, y: 0 };
  if (layout.cropApplied) {
    return {
      x: clampNumber(layout.crop.x + (canvasX / layout.outputWidth) * layout.crop.width, 0, layout.baseWidth),
      y: clampNumber(layout.crop.y + (canvasY / layout.outputHeight) * layout.crop.height, 0, layout.baseHeight),
    };
  }
  return {
    x: clampNumber((canvasX / layout.outputWidth) * layout.baseWidth, 0, layout.baseWidth),
    y: clampNumber((canvasY / layout.outputHeight) * layout.baseHeight, 0, layout.baseHeight),
  };
}

function handleImageMosaicPointerDown(event) {
  if (!imageMosaicSource) {
    imageMosaicStatus.textContent = "请先上传图片。";
    return;
  }
  if (!["crop", "mosaic"].includes(activeImageEditTool)) return;
  event.preventDefault();
  imageMosaicCanvas.setPointerCapture(event.pointerId);
  isDrawingMosaic = true;
  imageMosaicStartPoint = getImageMosaicCanvasPoint(event);
  imageMosaicDraftRegion = { x: imageMosaicStartPoint.x, y: imageMosaicStartPoint.y, width: 0, height: 0 };
}

function handleImageMosaicPointerMove(event) {
  if (!isDrawingMosaic || !imageMosaicStartPoint) return;
  event.preventDefault();
  let point = getImageMosaicCanvasPoint(event);
  if (activeImageEditTool === "crop" && lastImageRenderLayout) {
    point = constrainRegionToAspect(
      imageMosaicStartPoint,
      point,
      getCropAspectRatio(),
      lastImageRenderLayout.baseWidth,
      lastImageRenderLayout.baseHeight,
    );
  }
  imageMosaicDraftRegion = {
    x: imageMosaicStartPoint.x,
    y: imageMosaicStartPoint.y,
    width: point.x - imageMosaicStartPoint.x,
    height: point.y - imageMosaicStartPoint.y,
  };
  drawImageMosaicPreview();
}

function finishImageMosaicRegion(event) {
  if (!isDrawingMosaic) return;
  event.preventDefault();
  const layout = lastImageRenderLayout;
  const region = layout
    ? normalizeRegion(imageMosaicDraftRegion, layout.baseWidth, layout.baseHeight)
    : normalizeMosaicRegion(imageMosaicDraftRegion);
  if (region && activeImageEditTool === "crop") {
    imageCropRegion = region;
    syncImageResizeInputsToSource(true);
    pushImageEditHistory();
  } else if (region && activeImageEditTool === "mosaic") {
    imageMosaicRegions.push(region);
    pushImageEditHistory();
  }
  isDrawingMosaic = false;
  imageMosaicStartPoint = null;
  imageMosaicDraftRegion = null;
  drawImageMosaicPreview();
}

function getProfile() {
  return profiles[activeProfile];
}

function getRecords() {
  return getProfile().records;
}

function getSettings() {
  return getProfile().settings;
}

function toIsoDate(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortRecords(items = getRecords()) {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

function getRangeRecords() {
  const sorted = sortRecords();
  if (activeRange === "all" || sorted.length === 0) return sorted;

  const latestDate = new Date(sorted[sorted.length - 1].date);
  const startDate = new Date(latestDate);
  startDate.setDate(startDate.getDate() - Number(activeRange) + 1);

  return sorted.filter((item) => new Date(item.date) >= startDate);
}

function formatWeight(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)} kg` : "--";
}

function formatDelta(value) {
  if (!Number.isFinite(value) || value === 0) return "0.00 kg";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)} kg`;
}

function calculateBmi(weight) {
  const height = Number(getSettings().height);
  if (!weight || !height) return null;
  return weight / (height / 100) ** 2;
}

function getBmiLabel(bmi) {
  if (!bmi) return "--";
  if (bmi < 18.5) return `${bmi.toFixed(1)} 偏低`;
  if (bmi < 24) return `${bmi.toFixed(1)} 正常`;
  if (bmi < 28) return `${bmi.toFixed(1)} 偏高`;
  return `${bmi.toFixed(1)} 较高`;
}

function movingAverage(items, size = 7) {
  if (items.length === 0) return null;
  const latest = items.slice(-size);
  const total = latest.reduce((sum, item) => sum + item.weight, 0);
  return total / latest.length;
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toIsoDate(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const headingMatch = line.match(/^\*\*(\d+\.\s*.+?)\*\*$/) || line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(headingMatch[1])}</h3>`);
      continue;
    }

    const numberedHeading = line.match(/^(\d+\.\s*[^：:]+[：:]?)$/);
    if (numberedHeading) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(numberedHeading[1])}</h3>`);
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(listMatch[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join("");
}

function buildAnalysisPrompt() {
  const profileName = profileMeta[activeProfile].name;
  const settings = getSettings();
  const sorted = sortRecords();
  const recentRecords = sorted.slice(-21);
  const latest = sorted[sorted.length - 1];
  const average = movingAverage(sorted);
  const bmi = calculateBmi(latest?.weight);
  const extraContext = analysisContextInput.value.trim() || "无";

  return [
    `分析对象：${profileName}`,
    `明日日期：${getTomorrowDate()}`,
    `性别配置：${settings.gender || "未设置"}`,
    `身高：${settings.height || "未填写"} cm`,
    `目标体重：${settings.target || "未填写"} kg`,
    `当前体重：${latest ? `${latest.weight} kg，记录日期 ${latest.date}` : "暂无"}`,
    `7日均值：${average ? `${average.toFixed(1)} kg` : "暂无"}`,
    `BMI：${bmi ? bmi.toFixed(1) : "暂无"}`,
    `用户补充的明日/近期计划：${extraContext}`,
    "近期记录：",
    ...recentRecords.map((item) => `- ${item.date}: ${item.weight} kg；备注：${item.note || "无"}`),
    "",
    "请用中文输出，结构固定为：",
    "1. 明日体重预测：必须给出合理区间、最可能数值和置信度。",
    "2. 主要影响因素：结合近期体重、备注、用户补充计划，判断水分、盐分、晚餐、运动、睡眠、称重时机等因素。",
    "3. 明日行动建议：结合性别配置，给出称重、饮水、运动强度、睡眠和记录建议，不要输出饮食菜单或饮食计划。",
    "4. 备注模式总结：归纳历史备注里反复出现且可能影响体重波动的模式；如果备注不足，明确写“备注不足，暂不能形成稳定模式”，不要半句结束。",
    "要求：不要做疾病诊断，不要给极端节食建议，不需要饮食建议。每节 2-4 条，必须完整输出第 4 节后再结束，控制在 900 字以内。",
  ].join("\n");
}

async function runDeepSeekAnalysis() {
  const sorted = sortRecords();
  const previousAnalysis = { ...savedDeepSeekAnalysis };
  const contextAtSubmit = analysisContextInput.value.trim();

  if (sorted.length < 2) {
    aiOutput.textContent = "至少需要两条体重记录，才能生成有参考价值的趋势分析。";
    return;
  }

  if (Number(deepSeekUsage.used || 0) >= Number(deepSeekUsage.limit || 3)) {
    aiOutput.insertAdjacentHTML(
      "afterbegin",
      `<p class="analysis-error">今日 DeepSeek 分析次数已用完，每个账号每天最多 ${deepSeekUsage.limit || 3} 次。</p>`,
    );
    renderDeepSeekUsage();
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.textContent = "分析中...";
  aiOutput.classList.add("loading");
  aiOutput.textContent = "正在请求 DeepSeek，请稍候。";

  try {
    const response = await fetch(LOCAL_DEEPSEEK_ENDPOINT, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "你是一个谨慎的体重记录分析助手，只基于用户提供的数据做日常趋势、体重波动、运动作息和记录分析，并在建议中考虑性别差异。",
          },
          {
            role: "user",
            content: buildAnalysisPrompt(),
          },
        ],
        temperature: 0.35,
        max_tokens: 1600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText.slice(0, 180);
      try {
        errorMessage = JSON.parse(errorText).error || errorMessage;
      } catch {
        // Keep the plain response text when the backend returns non-JSON errors.
      }
      throw new Error(`请求失败：${response.status} ${errorMessage}`);
    }

    const data = await response.json();
    if (data?.dailyUsage) {
      deepSeekUsage = {
        used: Number(data.dailyUsage.used || 0),
        limit: Number(data.dailyUsage.limit || 3),
      };
      renderDeepSeekUsage();
    }
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (content) {
      savedDeepSeekAnalysis = {
        context: contextAtSubmit,
        result: content,
        updatedAt: new Date().toISOString(),
      };
      await saveDeepSeekAnalysis();
      if (!data?.dailyUsage) {
        deepSeekUsage.used = Math.min(Number(deepSeekUsage.used || 0) + 1, Number(deepSeekUsage.limit || 3));
        renderDeepSeekUsage();
        await loadDeepSeekUsage();
      }
      renderDeepSeekAnalysis();
    } else {
      aiOutput.textContent = "DeepSeek 没有返回分析内容。";
    }
  } catch (error) {
    savedDeepSeekAnalysis = previousAnalysis;
    if (previousAnalysis.result) {
      renderDeepSeekAnalysis();
      aiOutput.insertAdjacentHTML(
        "afterbegin",
        `<p class="analysis-error">本次分析失败，下面仍保留上次分析结果：${escapeHtml(error.message)}</p>`,
      );
    } else {
      aiOutput.textContent = `分析失败：${error.message}`;
    }
    await loadDeepSeekUsage();
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = "生成分析";
    aiOutput.classList.remove("loading");
  }
}

function renderMetrics() {
  const settings = getSettings();
  const sorted = sortRecords();
  const ranged = getRangeRecords();
  const latest = sorted[sorted.length - 1];
  const firstInRange = ranged[0];
  const change = latest && firstInRange ? latest.weight - firstInRange.weight : null;
  const average = movingAverage(sorted);
  const bmi = calculateBmi(latest?.weight);

  document.querySelector("#currentWeight").textContent = latest ? formatWeight(latest.weight) : "--";
  document.querySelector("#rangeChange").textContent = Number.isFinite(change)
    ? formatDelta(change)
    : "--";
  document.querySelector("#avgWeight").textContent = average ? formatWeight(average) : "--";
  document.querySelector("#bmiValue").textContent = getBmiLabel(bmi);

  const summary = document.querySelector("#summaryText");
  const profileName = profileMeta[activeProfile].name;
  if (!sorted.length) {
    summary.textContent = `${profileName} 暂无记录`;
    return;
  }

  const totalChange = sorted[sorted.length - 1].weight - sorted[0].weight;
  summary.textContent = `${profileName} 共 ${sorted.length} 条记录，从 ${sorted[0].date} 到 ${sorted[sorted.length - 1].date}，累计变化 ${formatDelta(totalChange)}`;
}

function renderTable() {
  const sortedDesc = sortRecords().reverse();
  recordsBody.innerHTML = "";

  if (!sortedDesc.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="empty-state" colspan="5">添加第一条体重记录后，这里会显示明细。</td>`;
    recordsBody.appendChild(row);
    return;
  }

  sortedDesc.forEach((record, index) => {
    const nextRecord = sortedDesc[index + 1];
    const delta = nextRecord ? record.weight - nextRecord.weight : 0;
    const deltaClass = delta > 0 ? "delta-up" : delta < 0 ? "delta-down" : "";
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = record.date;

    const weightCell = document.createElement("td");
    const weightStrong = document.createElement("strong");
    weightStrong.textContent = formatWeight(record.weight);
    weightCell.appendChild(weightStrong);

    const deltaCell = document.createElement("td");
    deltaCell.className = deltaClass;
    deltaCell.textContent = formatDelta(delta);

    const noteCell = document.createElement("td");
    noteCell.textContent = record.note || "无";

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.delete = record.date;
    deleteButton.textContent = "删除";
    actionCell.appendChild(deleteButton);

    row.append(dateCell, weightCell, deltaCell, noteCell, actionCell);
    recordsBody.appendChild(row);
  });
}

function renderHistoryCollapse() {
  historyTableWrap.classList.toggle("hidden", !isHistoryExpanded);
  toggleHistoryButton.textContent = isHistoryExpanded ? "折叠明细" : "展开明细";
  toggleHistoryButton.setAttribute("aria-expanded", String(isHistoryExpanded));
}

function renderChart() {
  const ctx = trendChart.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = trendChart.getBoundingClientRect();
  const width = rect.width || trendChart.parentElement?.clientWidth || 920;
  const height = rect.height || trendChart.parentElement?.clientHeight || 330;
  trendChart.width = Math.max(1, Math.floor(width * dpr));
  trendChart.height = Math.max(1, Math.floor(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const padding = { top: 44, right: 44, bottom: 54, left: 58 };
  const data = getRangeRecords();
  const settings = getSettings();

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (data.length < 2) {
    ctx.fillStyle = "#64736d";
    ctx.font = "600 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("至少需要两条记录才能形成趋势图", width / 2, height / 2);
    return;
  }

  const weights = data.map((item) => item.weight);
  const minWeight = Math.min(...weights, Number(settings.target || Infinity));
  const maxWeight = Math.max(...weights, Number(settings.target || -Infinity));
  const spread = Math.max(1, maxWeight - minWeight);
  const chartMin = minWeight - spread * 0.18;
  const chartMax = maxWeight + spread * 0.18;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xFor = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const yFor = (weight) =>
    padding.top + ((chartMax - weight) / (chartMax - chartMin)) * chartHeight;

  ctx.strokeStyle = "#dce5e1";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64736d";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";

  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    const value = chartMax - ((chartMax - chartMin) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(value.toFixed(2), padding.left - 10, y + 4);
  }

  if (settings.target) {
    const y = yFor(Number(settings.target));
    ctx.strokeStyle = "#d86143";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#a93e24";
    ctx.textAlign = "left";
    ctx.fillText("目标", padding.left + 8, y - 8);
  }

  const points = data.map((item, index) => ({
    x: xFor(index),
    y: yFor(item.weight),
    ...item,
  }));

  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, "rgba(18, 117, 108, 0.2)");
  gradient.addColorStop(1, "rgba(18, 117, 108, 0)");

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
  ctx.lineTo(points[0].x, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = "#12756c";
  ctx.lineWidth = 3;
  ctx.stroke();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#12756c";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.font = "700 12px sans-serif";
  ctx.textAlign = "center";
  points.forEach((point, index) => {
    const label = point.weight.toFixed(2);
    const isHighPoint = point.y < padding.top + 18;
    const labelY = isHighPoint ? point.y + 20 : point.y - 12;
    const labelX = Math.min(Math.max(point.x, padding.left + 18), width - padding.right - 18);

    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    const textWidth = ctx.measureText(label).width + 12;
    ctx.fillRect(labelX - textWidth / 2, labelY - 13, textWidth, 18);
    ctx.fillStyle = index === points.length - 1 ? "#0b5d56" : "#17201d";
    ctx.fillText(label, labelX, labelY);
  });

  ctx.fillStyle = "#64736d";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].forEach((point) => {
    ctx.fillText(point.date.slice(5), point.x, height - 18);
  });
}

function getGenderText(value) {
  if (value === "male") return "男";
  if (value === "female") return "女";
  return "未设置";
}

function renderProfilePanel() {
  const settings = getSettings();
  if (!settings.target && !settings.height && (!settings.gender || settings.gender === "unspecified")) {
    profileSummaryLabel.textContent = "登录后先填写基础信息，保存后用于 BMI 与趋势分析。";
    return;
  }

  const target = settings.target ? `目标 ${settings.target} kg` : "目标未填写";
  const height = settings.height ? `身高 ${settings.height} cm` : "身高未填写";
  const gender = getGenderText(settings.gender);
  profileSummaryLabel.textContent = `${target} · ${height} · 性别 ${gender}`;
}

function render() {
  const settings = getSettings();
  targetInput.value = settings.target || "";
  heightInput.value = settings.height || "";
  genderInput.value = settings.gender || "unspecified";
  document.querySelector("#activeProfileLabel").textContent =
    `正在记录：${profileMeta[activeProfile].name}`;
  document.querySelector("#aiProfileLabel").textContent =
    `基于${profileMeta[activeProfile].name}的近期记录、备注和补充计划生成明日分析`;
  profileButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.profile === activeProfile);
  });
  renderMetrics();
  renderTable();
  renderHistoryCollapse();
  renderProfilePanel();
  renderChart();
}

entryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const weight = Number(weightInput.value);
  if (!date || !Number.isFinite(weight)) return;

  const nextRecord = {
    date,
    weight: Number(weight.toFixed(2)),
    note: noteInput.value.trim(),
  };

  try {
    await apiRequest("/records", {
      method: "POST",
      body: JSON.stringify({
        profileKey: activeProfile,
        ...nextRecord,
      }),
    });

    profiles[activeProfile].records = getRecords()
      .filter((item) => item.date !== date)
      .concat(nextRecord);
    weightInput.value = "";
    noteInput.value = "";
    render();
  } catch (error) {
    alert(`保存失败：${error.message}`);
  }
});

saveProfileButton.addEventListener("click", async () => {
  const nextSettings = {
    target: targetInput.value ? Number(targetInput.value) : "",
    height: heightInput.value ? Number(Number(heightInput.value).toFixed(1)) : "",
    gender: genderInput.value,
  };

  try {
    await apiRequest("/settings", {
      method: "PUT",
      body: JSON.stringify({
        profileKey: activeProfile,
        target: nextSettings.target,
        height: nextSettings.height,
        gender: nextSettings.gender,
      }),
    });
    profiles[activeProfile].settings = nextSettings;
    render();
  } catch (error) {
    alert(`资料保存失败：${error.message}`);
  }
});

recordsBody.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;

  try {
    await apiRequest(
      `/records?profileKey=${encodeURIComponent(activeProfile)}&date=${encodeURIComponent(button.dataset.delete)}`,
      { method: "DELETE" },
    );
    profiles[activeProfile].records = getRecords().filter(
      (item) => item.date !== button.dataset.delete,
    );
    render();
  } catch (error) {
    alert(`删除失败：${error.message}`);
  }
});

toggleHistoryButton.addEventListener("click", () => {
  isHistoryExpanded = !isHistoryExpanded;
  renderHistoryCollapse();
});

profileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeProfile = button.dataset.profile;
    weightInput.value = "";
    noteInput.value = "";
    aiOutput.textContent =
      `已切换到${profileMeta[activeProfile].name}。点击生成分析，会只使用当前人员的体重记录。`;
    render();
  });
});

authTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
  });
});

forgotPasswordLink?.addEventListener("click", (event) => {
  event.preventDefault();
  authMessage.textContent = "请联系管理员在账号管理中重置密码。";
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  const payload = {
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  };

  try {
    const data = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    passwordInput.value = "";
    showApp(data.user);
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

changePasswordButton.addEventListener("click", showPasswordPage);

cancelPasswordButton.addEventListener("click", () => {
  showDashboard();
  passwordMessage.textContent = "";
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordMessage.textContent = "";
  if (newPasswordInput.value !== repeatNewPasswordInput.value) {
    passwordMessage.textContent = "两次输入的新密码不一致";
    return;
  }
  try {
    await apiRequest("/password/change", {
      method: "POST",
      body: JSON.stringify({
        oldPassword: oldPasswordInput.value,
        newPassword: newPasswordInput.value,
      }),
    });
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    repeatNewPasswordInput.value = "";
    passwordMessage.textContent = "密码已修改";
  } catch (error) {
    passwordMessage.textContent = error.message;
  }
});

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (accountFormMessage) accountFormMessage.textContent = "";
  const payload = {
    id: accountIdInput.value || undefined,
    username: accountUsernameInput.value.trim(),
    displayName: accountDisplayNameInput.value.trim() || accountUsernameInput.value.trim(),
    password: accountPasswordInput.value,
    isAdmin: accountRoleInput?.value === "admin",
  };
  try {
    await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    closeAccountModal();
    if (accountMessage) {
      accountMessage.textContent = payload.id ? "账号信息已更新。" : "新账号已创建。";
    }
    await loadManagedUsers();
  } catch (error) {
    if (accountFormMessage) accountFormMessage.textContent = error.message;
  }
});

cancelAccountEditButton?.addEventListener("click", closeAccountModal);
openAccountModalButton?.addEventListener("click", () => openAccountModal("create"));
accountModal?.querySelectorAll("[data-close-account-modal]").forEach((node) => {
  node.addEventListener("click", closeAccountModal);
});

async function performLogout() {
  try {
    await apiRequest("/logout", { method: "POST", body: "{}" });
  } finally {
    profiles = defaultProfiles();
    render();
    showAuth();
  }
}

logoutButton.addEventListener("click", performLogout);
sidebarLogoutButton?.addEventListener("click", performLogout);

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    if (page === "dashboard") showDashboard();
    if (page === "tools") showToolHome();
    if (page === "admin") showAdminManagement();
    if (page === "password") showPasswordPage();
  });
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedToolId = button.dataset.tool;
    showToolHome();
  });
  button.addEventListener("dblclick", () => {
    selectedToolId = button.dataset.tool;
    switchTool(button.dataset.tool);
  });
});

adminToolCard?.addEventListener("click", showAdminManagement);
backToToolsButton.addEventListener("click", showToolHome);

[toolSearchInput, toolStatusFilter, toolSortFilter].forEach((input) => {
  input?.addEventListener("input", renderToolCenter);
  input?.addEventListener("change", renderToolCenter);
});

resetToolFiltersButton?.addEventListener("click", () => {
  currentToolCategory = "all";
  if (toolSearchInput) toolSearchInput.value = "";
  if (toolStatusFilter) toolStatusFilter.value = "all";
  if (toolSortFilter) toolSortFilter.value = "default";
  renderToolCenter();
});

globalSearchInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (toolSearchInput) toolSearchInput.value = globalSearchInput.value;
  showToolHome();
});

[
  watermarkTextInput,
  watermarkFontInput,
  watermarkSizeInput,
  watermarkColorInput,
  watermarkOpacityInput,
  watermarkAngleInput,
  watermarkGapXInput,
  watermarkGapYInput,
  watermarkModeInput,
].forEach((input) => {
  input?.addEventListener("input", () => {
    updateWatermarkOpacityLabel();
    drawWatermarkPreview();
  });
  input?.addEventListener("change", () => {
    updateWatermarkOpacityLabel();
    drawWatermarkPreview();
  });
});

document.querySelector("#pdfTool .pdf-tool-list")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pdf-tool]");
  if (!button || button.dataset.pdfTool === activePdfTool) return;
  setActivePdfTool(button.dataset.pdfTool);
});

refreshPdfPreviewButton?.addEventListener("click", () => {
  drawWatermarkPreview();
});

watermarkImageInput.addEventListener("change", async () => {
  const file = watermarkImageInput.files?.[0];
  if (!file) return;

  revokeWatermarkOutputUrl();
  watermarkImage = null;
  watermarkPdfBytes = null;
  watermarkFileType = "";
  watermarkFileName = file.name.replace(/\.[^.]+$/, "") + "-processed";
  updatePdfFileLabel(file.name);
  pdfPageCount = 0;
  updatePdfMeta();

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    watermarkFileType = "pdf";
    try {
      invalidatePdfJsDocument();
      pdfRedactionCurrentPage = 1;
      pdfRedactionZoom = 1;
      watermarkPdfBytes = await file.arrayBuffer();
      await drawWatermarkPreview();
    } catch (error) {
      watermarkStatus.textContent = `PDF 预览失败：${error.message}`;
    }
    return;
  }

  watermarkStatus.textContent = "请选择 PDF 文件。";
  updatePdfPreviewPlaceholder();
  watermarkImageInput.value = "";
});

watermarkForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await saveWatermarkSettings();
    await drawWatermarkPreview();
    watermarkStatus.textContent = "水印已生成，配置已保存。";
  } catch (error) {
    watermarkStatus.textContent = `水印生成失败：${error.message}`;
  }
});

saveWatermarkSettingsButton.addEventListener("click", async () => {
  try {
    await saveWatermarkSettings();
    if (watermarkPdfBytes) {
      await drawWatermarkPreview();
    }
    watermarkStatus.textContent = "当前 PDF 处理模板已保存。";
  } catch (error) {
    watermarkStatus.textContent = `配置保存失败：${error.message}`;
  }
});

undoPdfRedactionButton?.addEventListener("click", undoLastPdfRedaction);

pdfPrevPageButton?.addEventListener("click", () => setPdfRedactionPage(pdfRedactionCurrentPage - 1));
pdfNextPageButton?.addEventListener("click", () => setPdfRedactionPage(pdfRedactionCurrentPage + 1));
pdfZoomOutButton?.addEventListener("click", () => adjustPdfRedactionZoom(1 / PDF_REDACTION_ZOOM_STEP));
pdfZoomInButton?.addEventListener("click", () => adjustPdfRedactionZoom(PDF_REDACTION_ZOOM_STEP));
pdfZoomFitButton?.addEventListener("click", () => setPdfRedactionZoom(1, { force: true }));

pdfPreviewCanvasWrap?.addEventListener(
  "wheel",
  (event) => {
    if (!watermarkPdfBytes || !["redaction", "watermark", "translate"].includes(activePdfTool)) return;
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    adjustPdfRedactionZoom(event.deltaY < 0 ? PDF_REDACTION_ZOOM_STEP : 1 / PDF_REDACTION_ZOOM_STEP);
  },
  { passive: false },
);

pdfRedactionPageInput?.addEventListener("change", () => setPdfRedactionPage(pdfRedactionPageInput.value));
pdfRedactionTypeInput?.addEventListener("change", () => {
  updatePdfRedactionParamVisibility();
  if (activePdfTool === "redaction" && watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
});

pdfRedactionBlockSizeInput?.addEventListener("input", () => {
  updatePdfRedactionParamVisibility();
  if (activePdfTool === "redaction" && watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
});


pdfRedactionColorInput?.addEventListener("input", () => {
  if (activePdfTool === "redaction" && watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
});

pdfRedactionOpacityInput?.addEventListener("input", () => {
  updatePdfRedactionOpacityLabel();
  if (activePdfTool === "redaction" && watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
});
pdfRedactionOpacityInput?.addEventListener("change", () => {
  updatePdfRedactionOpacityLabel();
  if (activePdfTool === "redaction" && watermarkPdfBytes) {
    void drawWatermarkPreview();
  }
});

watermarkCanvas?.addEventListener("pointerdown", handlePdfRedactionPointerDown);
watermarkCanvas?.addEventListener("pointermove", handlePdfRedactionPointerMove);
watermarkCanvas?.addEventListener("pointerup", finishPdfRedactionRegion);
watermarkCanvas?.addEventListener("pointercancel", finishPdfRedactionRegion);

clearPdfRedactionsButton?.addEventListener("click", () => {
  pdfRedactions = [];
  renderPdfRedactions();
  drawWatermarkPreview();
});

pdfRedactionList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-redaction-index]");
  if (!button) return;
  pdfRedactions.splice(Number(button.dataset.redactionIndex), 1);
  renderPdfRedactions();
  drawWatermarkPreview();
});

downloadWatermarkButton.addEventListener("click", async () => {
  if (!watermarkPdfBytes) {
    watermarkStatus.textContent = "请先上传 PDF 文件。";
    return;
  }
  if (!window.PDFLib) {
    watermarkStatus.textContent = "PDF 处理需要 pdf-lib，请强制刷新页面后重试。";
    return;
  }
  watermarkStatus.textContent = "正在生成 PDF...";
  try {
    await drawWatermarkPreview();
  } catch (error) {
    watermarkStatus.textContent = `PDF 生成失败：${error.message}`;
    return;
  }
  if (!watermarkOutputUrl) {
    watermarkStatus.textContent = "PDF 文件尚未生成，请稍后重试。";
    return;
  }
  const link = document.createElement("a");
  link.href = watermarkOutputUrl;
  link.download = `${watermarkFileName}.pdf`;
  link.click();
  watermarkStatus.textContent = "PDF 已导出，可再次调整参数后重新导出。";
});

document.querySelector("#imageTool .image-tool-list, #imageTool .detail-tool-list")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-image-tool]");
  if (!button || button.dataset.imageTool === activeImageEditTool) return;
  setActiveImageTool(button.dataset.imageTool);
});

[
  imageMosaicBlockInput,
  imageMosaicFormatInput,
  imageFormatQualityInput,
  imageFormatBackgroundInput,
  imageCropAspectInput,
  imageResizeWidthInput,
  imageResizeHeightInput,
  imageKeepRatioInput,
  imageQualityInput,
  imageBackgroundColorInput,
  imageGrayscaleInput,
  imageWatermarkTextInput,
  imageWatermarkModeInput,
  imageWatermarkSizeInput,
  imageWatermarkColorInput,
  imageWatermarkOpacityInput,
  imageWatermarkAngleInput,
  imageBrightnessInput,
  imageContrastInput,
  imageSaturationInput,
  imageRotationInput,
  imageFlipHorizontalInput,
  imageFlipVerticalInput,
].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === imageMosaicFormatInput) {
      updateImageFormatParamVisibility();
    }
    updateImageSliderLabels();
    drawImageMosaicPreview();
  });
  input.addEventListener("change", () => {
    if (input === imageMosaicFormatInput) {
      updateImageFormatParamVisibility();
    }
    updateImageSliderLabels();
    drawImageMosaicPreview();
  });
});

imageResizeWidthInput.addEventListener("input", () => {
  syncImageResizeRatio("width");
  drawImageMosaicPreview();
});
imageResizeHeightInput.addEventListener("input", () => {
  syncImageResizeRatio("height");
  drawImageMosaicPreview();
});

clearImageCropButton.addEventListener("click", () => {
  imageCropRegion = null;
  imageMosaicDraftRegion = null;
  syncImageResizeInputsToSource(true);
  pushImageEditHistory();
  drawImageMosaicPreview();
});

imageUndoButton?.addEventListener("click", undoImageEdit);
imageRedoButton?.addEventListener("click", redoImageEdit);

imageMosaicInput.addEventListener("change", () => {
  const file = imageMosaicInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    imageMosaicStatus.textContent = "请选择图片文件。";
    return;
  }

  imageMosaicSource = null;
  imageMosaicRegions = [];
  imageMosaicDraftRegion = null;
  imageCropRegion = null;
  imageMosaicFileName = file.name.replace(/\.[^.]+$/, "") + "-edited";
  imageOriginalFileSize = file.size || 0;
  updateImageFileLabel(file.name);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(image.src);
    imageMosaicSource = image;
    imageMosaicRegions = [];
    imageCropRegion = null;
    syncImageResizeInputsToSource(true);
    resetImageEditHistory();
    drawImageMosaicPreview();
  };
  image.onerror = () => {
    URL.revokeObjectURL(image.src);
    imageMosaicStatus.textContent = "图片读取失败，请换一张图片重试。";
  };
  image.src = URL.createObjectURL(file);
});

imageMosaicForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await saveImageMosaicSettings();
    drawImageMosaicPreview();
    imageMosaicStatus.textContent = "图片编辑参数已保存。";
  } catch (error) {
    imageMosaicStatus.textContent = `设置保存失败：${error.message}`;
  }
});

saveImageTemplateButton.addEventListener("click", async () => {
  try {
    await saveImageMosaicSettings();
    imageMosaicStatus.textContent = "当前图片处理模板已保存。";
  } catch (error) {
    imageMosaicStatus.textContent = `模板保存失败：${error.message}`;
  }
});

resetImageEditsButton?.addEventListener("click", () => {
  imageMosaicSettings = defaultImageMosaicSettings();
  imageMosaicRegions = [];
  imageMosaicDraftRegion = null;
  imageCropRegion = null;
  renderImageMosaicSettings();
  syncImageResizeInputsToSource(true);
  resetImageEditHistory();
  drawImageMosaicPreview();
});

undoMosaicRegionButton?.addEventListener("click", () => {
  imageMosaicRegions.pop();
  pushImageEditHistory();
  drawImageMosaicPreview();
});

clearMosaicRegionsButton?.addEventListener("click", () => {
  imageMosaicRegions = [];
  imageMosaicDraftRegion = null;
  pushImageEditHistory();
  drawImageMosaicPreview();
});

downloadImageMosaicButton.addEventListener("click", async () => {
  if (!imageMosaicSource) {
    imageMosaicStatus.textContent = "请先上传图片。";
    return;
  }
  imageMosaicDraftRegion = null;
  const tool = activeImageEditTool;
  const settings = readImageMosaicSettings();
  const exportCanvas = document.createElement("canvas");
  renderProcessedImageCanvas(exportCanvas, {
    tool,
    exporting: true,
    forceApplyCrop: tool === "crop",
    showGuides: false,
  });
  const { format, quality } = getImageExportFormatAndQuality(tool, settings);

  try {
    if (format === "pdf") {
      const bytes = await buildImagePdfBytes(exportCanvas, settings);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageMosaicFileName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const mimeTypes = {
        jpeg: "image/jpeg",
        webp: "image/webp",
        png: "image/png",
      };
      const extensions = {
        jpeg: "jpg",
        webp: "webp",
        png: "png",
      };
      const mimeType = mimeTypes[format] || "image/png";
      const extension = extensions[format] || "png";
      const link = document.createElement("a");
      link.href = exportCanvas.toDataURL(mimeType, quality);
      link.download = `${imageMosaicFileName}.${extension}`;
      link.click();
    }
  } catch (error) {
    if (imageMosaicStatus) {
      imageMosaicStatus.textContent = `导出失败：${error.message}`;
      imageMosaicStatus.classList.remove("hidden");
    }
    return;
  }

  drawImageMosaicPreview();
  if (imageMosaicStatus) {
    imageMosaicStatus.textContent =
      format === "pdf" ? "PDF 已导出，可继续调整参数后重新导出。" : "图片已导出，可继续调整参数后重新导出。";
    imageMosaicStatus.classList.toggle("hidden", !["crop", "mosaic"].includes(tool));
  }
});

imageZoomOutButton?.addEventListener("click", () => adjustImagePreviewZoom(1 / IMAGE_PREVIEW_ZOOM_STEP));
imageZoomInButton?.addEventListener("click", () => adjustImagePreviewZoom(IMAGE_PREVIEW_ZOOM_STEP));
imageZoomFitButton?.addEventListener("click", () => setImagePreviewZoom(1, { force: true }));

imageMosaicCanvas.addEventListener("pointerdown", handleImageMosaicPointerDown);
imageMosaicCanvas.addEventListener("pointermove", handleImageMosaicPointerMove);
imageMosaicCanvas.addEventListener("pointerup", finishImageMosaicRegion);
imageMosaicCanvas.addEventListener("pointercancel", finishImageMosaicRegion);

rangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRange = button.dataset.range;
    rangeButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

refreshChartButton.addEventListener("click", () => {
  renderMetrics();
  requestAnimationFrame(renderChart);
});

document.querySelector("#fillTodayButton").addEventListener("click", () => {
  dateInput.value = toIsoDate();
  weightInput.focus();
});

document.querySelector("#clearButton").addEventListener("click", async () => {
  const profileName = profileMeta[activeProfile].name;
  if (!confirm(`确定清空${profileName}的全部体重记录吗？`)) return;

  try {
    await apiRequest("/records/clear", {
      method: "POST",
      body: JSON.stringify({ profileKey: activeProfile }),
    });
    profiles[activeProfile].records = [];
    render();
  } catch (error) {
    alert(`清空失败：${error.message}`);
  }
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const header = ["person", "date", "weight_kg", "note"];
  const rows = sortRecords().map((item) => [
    profileMeta[activeProfile].name,
    item.date,
    item.weight,
    item.note || "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `weight-records-${profileMeta[activeProfile].fileName}-${toIsoDate()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

analyzeButton.addEventListener("click", runDeepSeekAnalysis);

window.addEventListener("resize", () => {
  renderChart();
  if (imageMosaicSource) {
    applyImagePreviewDisplayScale();
  }
});

dateInput.value = toIsoDate();
setAuthMode("login");
render();
renderWatermarkSettings();
renderImageMosaicSettings();
setActiveImageTool("crop", { preserveUpload: true });
setActivePdfTool("watermark");
updatePdfPreviewPlaceholder();
updatePdfMeta();
updateImagePreviewPlaceholder();
updateImagePreviewChrome();
updateImageSliderLabels();
bindDropUploadZone(".image-upload-zone", "#imageMosaicInput");
bindDropUploadZone(".pdf-upload-zone", "#watermarkImageInput");
showToolHome();
checkSession();
ensurePdfJsWorker();

// ─── 数字转大写工具 ────────────────────────────────────────────────────────────

function _numConvertFourDigits(s, DIGITS, UNITS4) {
  const padded = s.padStart(4, "0");
  let result = "";
  let zeroPending = false;
  for (let i = 0; i < 4; i++) {
    const d = parseInt(padded[i]);
    if (d === 0) {
      zeroPending = true;
    } else {
      if (zeroPending && result) result += DIGITS[0];
      zeroPending = false;
      result += DIGITS[d] + UNITS4[i];
    }
  }
  return result;
}

function _numConvertInteger(intStr, DIGITS, UNITS4) {
  const clean = intStr.replace(/^0+/, "") || "0";
  if (clean === "0") return DIGITS[0];
  if (clean.length > 12) return null;

  const groups = [];
  let tmp = clean;
  while (tmp.length > 0) {
    groups.unshift(tmp.slice(-4));
    tmp = tmp.slice(0, -4);
  }

  const BIG_UNITS = ["", "万", "亿"];
  const addZero = (s) => (s && !s.endsWith(DIGITS[0]) ? s + DIGITS[0] : s);

  let result = "";
  for (let i = 0; i < groups.length; i++) {
    const groupVal = parseInt(groups[i]);
    const groupStr = _numConvertFourDigits(groups[i], DIGITS, UNITS4);
    const bigUnit = BIG_UNITS[groups.length - 1 - i] || "";

    if (groupStr) {
      if (result && groupVal < 1000) result = addZero(result);
      result += groupStr + bigUnit;
    } else if (result && i < groups.length - 1) {
      result = addZero(result);
    }
  }
  return result.replace(new RegExp(`${DIGITS[0]}$`), "");
}

function numberToChineseCapital(input) {
  const str = String(input).trim().replace(/,/g, "");
  const isNeg = str.startsWith("-");
  const abs = isNeg ? str.slice(1) : str;
  if (!/^\d+(\.\d+)?$/.test(abs)) return null;

  const dotIdx = abs.indexOf(".");
  const intStr = dotIdx >= 0 ? abs.slice(0, dotIdx) : abs;
  const fracStr = dotIdx >= 0 ? (abs.slice(dotIdx + 1) + "00").slice(0, 2) : "00";

  const DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const UNITS4 = ["仟", "佰", "拾", ""];

  const intResult = _numConvertInteger(intStr, DIGITS, UNITS4);
  if (intResult === null) return "数字过大（超过千亿级别）";

  const jiao = parseInt(fracStr[0]);
  const fen = parseInt(fracStr[1]);

  let result = intResult !== DIGITS[0] ? intResult + "元" : "";

  if (jiao === 0 && fen === 0) {
    result = (result || "零元") + "整";
  } else if (jiao > 0 && fen === 0) {
    result += DIGITS[jiao] + "角整";
  } else if (jiao === 0) {
    if (result && !result.endsWith("零")) result += "零";
    result += DIGITS[fen] + "分";
    if (!result.startsWith("零") && intResult === DIGITS[0]) result = result;
  } else {
    result += DIGITS[jiao] + "角" + DIGITS[fen] + "分";
  }

  return isNeg ? "负" + result : result;
}

function numberToChineseLower(input) {
  const str = String(input).trim().replace(/,/g, "");
  const isNeg = str.startsWith("-");
  const abs = isNeg ? str.slice(1) : str;
  if (!/^\d+(\.\d+)?$/.test(abs)) return null;

  const dotIdx = abs.indexOf(".");
  const intStr = dotIdx >= 0 ? abs.slice(0, dotIdx) : abs;
  const fracDigits = dotIdx >= 0 ? abs.slice(dotIdx + 1).replace(/0+$/, "") : "";

  const DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const UNITS4 = ["千", "百", "十", ""];

  const intResult = _numConvertInteger(intStr, DIGITS, UNITS4);
  if (intResult === null) return "数字过大（超过千亿级别）";

  let result = intResult;
  if (fracDigits) {
    result += "点" + [...fracDigits].map((d) => DIGITS[parseInt(d)]).join("");
  }
  return isNeg ? "负" + result : result;
}

function updateNumConverterOutput() {
  const input = document.querySelector("#numConverterInput");
  const capitalEl = document.querySelector("#numConverterCapital");
  const lowerEl = document.querySelector("#numConverterLower");
  if (!input || !capitalEl || !lowerEl) return;

  const raw = input.value.trim();
  if (!raw) {
    capitalEl.textContent = "--";
    lowerEl.textContent = "--";
    capitalEl.closest(".num-converter-result-card")?.classList.remove("has-value");
    lowerEl.closest(".num-converter-result-card")?.classList.remove("has-value");
    return;
  }

  const capital = numberToChineseCapital(raw);
  const lower = numberToChineseLower(raw);

  capitalEl.textContent = capital ?? "格式有误，请输入有效数字";
  lowerEl.textContent = lower ?? "格式有误，请输入有效数字";
  capitalEl.closest(".num-converter-result-card")?.classList.toggle("has-value", capital !== null);
  lowerEl.closest(".num-converter-result-card")?.classList.toggle("has-value", lower !== null);
}

async function copyNumConverterValue(elementId, buttonEl) {
  const el = document.querySelector(`#${elementId}`);
  const text = el?.textContent?.trim();
  if (!text || text === "--" || text.includes("格式有误")) return;
  try {
    await navigator.clipboard.writeText(text);
    const original = buttonEl.textContent;
    buttonEl.textContent = "已复制";
    setTimeout(() => {
      buttonEl.textContent = original;
    }, 1500);
  } catch {
    /* ignore */
  }
}

document.querySelector("#numConverterInput")?.addEventListener("input", updateNumConverterOutput);

document.querySelector("#copyNumCapital")?.addEventListener("click", function () {
  copyNumConverterValue("numConverterCapital", this);
});

document.querySelector("#copyNumLower")?.addEventListener("click", function () {
  copyNumConverterValue("numConverterLower", this);
});

document.querySelectorAll(".num-converter-example-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.querySelector("#numConverterInput");
    if (!input) return;
    input.value = btn.dataset.num;
    updateNumConverterOutput();
  });
});

// ─── 通用工具函数 ──────────────────────────────────────────────────────────────

function bindDropUploadZone(zoneSelector, inputSelector) {
  const zone = document.querySelector(zoneSelector);
  const input = document.querySelector(inputSelector);
  if (!zone || !input) return;

  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.add("is-dragover");
    });
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("is-dragover");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-dragover");
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
