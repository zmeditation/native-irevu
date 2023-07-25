import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalizedStrings from "react-native-localization";

export const strings = new LocalizedStrings({
  "中⽂": {
    back: "背部",
    welcome: "欢迎使用我们的应用程序",
    login_subheading: "在此处登录以获取访问权限",
    forgot_subheading: "忘记密码了吗",
    register_subheading: "在此处注册以获取访问权限",
    forgot_password: "忘记密码？",
    login_capital: "登录",
    submit: "提交",
    register_here: "在这里注册",
    new_user: "新用户？",
    email_label: "电子邮件ID",
    username_or_email_label: "用户名或电子邮件 ID",
    password_label: "输入密码",
    password_placeholder: "输入密码",
    email_placeholder: "用户@email.com",
    signup_capital: "登记",
    enter_full_name: "输入全名",
    enter_username: "输入用户名",
    enter_std: "学生号码",
    select_university: "选择你的大学",
    select_course: "选择你的课程",
    refferral_code_label: "推荐代码",
    enter_referral_code: "输入推荐代码",
    subscriptions: "订阅",
    //register
    you_are_a: "你是一个",
    student: "学生",
    teacher: "老师",
    you: "你",
    at: "在",
    by_clicking_register: "点击注册，即表示您同意我们的",
    terms_data_policy: "条款数据政策",

    //home
    good_morning: "早上好",
    good_evening: "晚上好",
    top_3_performers: "每月前三名分别获得300、200、100元人民币",
    performers: "排⾏榜",

    // my classes
    my_classes: "我的课程",

    // questions
    open_questions: "待解决的问题", // 待解决的问题
    no_open_questions_found: "未找到未解决的问题",

    // drawer
    home: "我",
    forums: "论坛",
    notifications: "通知",
    classes: "班级",
    earn_points: "赚取积分",
    lesson_plans: "课程计划",
    resources: "资源",
    send_referral_link: "发送推荐链接",
    results: "结果",
    wallet: "钱包",
    contact_us: "联系我们",
    help_guide: "帮助指南",
    log_out: "退出",
    view_account: "查看账户",

    // contact us
    send_us_an_email_message_text: "给我们发送电子邮件，我们会尽快回复您",

    // Earn Points
    invite_teacher_student: "邀请⽼师＆学⽣",
    remember_the_more_teachers_and_students:
      "平台上注册的⽼师和学⽣⽤户数量越 多，赚取钱和积分的机会越⼤。",
    on_the_platform_the_more_chances_you: "",
    have_of_making_money_and_points: "",
    points_for_a_students: "邀请学⽣注册得50积分",
    points_for_a_teacher: "邀请⽼师注册得100积分",
    your_referral_link: "您的推荐链接",
    referrals: "转介",
    points_from_referrals: "推荐积分",

    // Post Questions:
    write_your_questions: "写下你的问题",
    your_question_will_be_posted_to_portal_on_success:
      "您的问题将在成功后发布到门户网站。",
    RMB: "人民币",
    total_price: "总价",
    price_platform_fee: "(价格 + 10% 平台费用)",
    summary: "概括",
    question: "问题",
    subject: "主题",
    post_capital: "邮政",

    // Ask A Question Row
    ask_a_new_question_capital: "提出新问题",
    ask_a_new_question: "问一个新问题",

    // CurrentQuestions.js
    closed_questions: "已解决的问题",
    no_close_question_found: "没有找到相关问题",

    // Write Your Question
    category: "类别",
    ask_who: "问谁",
    type_of_question: "问题类型",
    normal_question: "正常问题",
    academic_english: "学术英语",

    // Question Length
    for_students_questions: "对于学生问题:",
    for_teachers_questions: "对于教师问题:",
    you_cant_put_bid_less_than_recommended_amount: "您的出价不能低于推荐金额。",
    price_list: "价格表",
    platform_fee: "(加10%平台费)",
    question_type: "问题类型",
    your_remaining_free_question_is: "你剩下的免费问题是",
    we_cannot_guarantee_these_questions_will_be_answered:
      "(我们不能保证这些问题会得到解答)",
    short_question: "简短的问题",
    long_question: "长问题",
    time_limit: "时限",
    price: "价钱",

    // Performance Card
    view_all_capital: "查看全部",
    points_capital: "积分",
    points: "积分",
    position: "位置",
    questions_answered: "回答的问题",
    resources_created: "创建的资源",

    // Resources
    resources_by_others: "其他人的资源",
    my_resources: "我的资源",
    open: "打开",
    primary_school: "小学",
    middle_school: "中学",
    high_school: "中学",
    under_graduate: "大学本科",
    post_graduate: "研究生",
    grades: "成绩",
    paper_demo_before_purchase: "购买前的纸质演示",

    // Wallet
    balance: "平衡",
    withdraw: "提取",
    topup: "充值",
    transactions: "交易",
    transaction: "交易",
    student_id: "学生卡",
    issue_refund: "问题退款",
    are_you_sure: "你确定吗？",
    the_amount_will_be_refunded_to_the_student: "金额将退还给学生",
    return: "返回",
    credit_card_number_capital: "信用卡号码",
    name_capital: "名称",
    cvv_capital: "变异系数",
    country_capital: "国家",
    expiry_capital: "到期",
    topup_amount_capital: "充值金额",
    top_up: "充值",

    // Classes
    add_class_capital: "添加课程",
    enroll_in_a_class: "报名班级",
    or: "要么",
    scan_a_qr_code_capital: "扫描二维码",
    create_a_class: "创建一个类",

    // My Classes.js
    no_classes_found: "未找到课程",

    // HomeworkChat
    leave_this_question: "你将无法再回答这个问题。你想留下这个问题吗？",
    leave_question: "留下问题",

    // HomeworkInformation.js
    read_full: "阅读全文",
    read_less: "少读",
    grade: "年级",
    view: "看法",
    due_date: "截止日期",
    submissions: "提交",
    instructions: "指示",
    title: "标题",
    description: "描述",

    // HomeworkGrading.js
    grading_homework: "评分作业",

    // Homework Create
    title_capital: "标题",
    description_capital: "描述",
    deadline_date_capital: "截止日期",
    deadline_time_capital: "截止时间",
    overtime_capital: "随着时间的推移",
    overtime_alert: "我们不能设置超过加班时间的截止时间。",
    missing_values_alert: "缺失值",
    description_missing_alert: "缺少说明。",
    title_missing_alert: "标题不见了。",
    select_your_course: "选择您的课程",
    create_a_homework: "创建家庭作业",
    create_a_homework_capital: "创建家庭作业",

    // EnrollStudentModal
    enroll_student: "招收学生",
    student_username_email: "学生用户名/电子邮件",
    or_capital: "要么",
    share_qr_code_with_students: "与学生分享二维码",
    enroll_student_capital: "招收学生",

    // BOTTOM TAB BAR // TOP HEADER
    dashboard: "我的主⻚",
    forum: "论坛",
    // home: 'Home',

    // Profile -> Edit.js
    profile_picture: "个人资料图片", //

    // Loader Component Spinner
    please_wait_loader: "请稍等...",

    // Welcome
    continue_using_wechat: "继续使用微信",

    // ClassFacePiles.js
    students: "学生",
    currently_enrolled: "目前就读",
    no_students_currently_enrolled: "目前没有学生注册",

    // TextEditor.js
    start_writing_here: "从这里开始写作",
    wordcount: "字数",

    // Card.js
    view_more: "查看更多",
    view_less: "查看更少",
    days_left: " 还剩几天",
    todays: "今天",
    result_capital: "结果",
    view_capital: "看法",

    // MultiFunctionTextEditor
    download: "下载",
    save_capital: "节省",

    // LessonPlan and Resources Plan
    purchase_the_complete_paper: "购买完整的纸张",
    pay: "支付",
    service: "服务",
    cost: "成本",
    resource: "资源",
    total: "全部的",
    search_paper: "搜索论文（如数学、代数）",
    lesson_plans_by_others: "其他人的课程计划",
    skill_capital: "技能",
    please_add_teachers_notes_if_required_capital: "如果需要，请添加教师注释",
    you_can_have_maximum_of_10_lesson_plan: "您最多可以拥有 10 个课程计划",

    // AddResources
    education_level: "教育程度",
    subject_capital: "主题",
    no_of_page_to_show_as_sample: "作为样本显示的页数",
    grade_capital: "年级",
    price_capital: "价钱",
    you_can_have_maximum_of_10_resources: "您最多可以拥有 10 个资源",
    publish_capital: "发布",

    // navigation -> index.js
    view_all_performance: "查看所有表现",
    my_lesson_plans: "我的课程计划",
    add_lesson_plans: "添加课程计划",
    account: "帐户",
    add_resource: "添加资源",
    write_your_question: "写下你的问题",
    edit_question: "编辑问题",
    feedback: "回馈",
    homework_chat: "作业聊天",
    homework: "在家工作",

    // Current Homework
    current_homework_capital: "当前作业",
    no_homeworks_today_capital: "今天没有家庭作业",

    // Auth.js
    you_really_want_to_log_out: "你真的要退出吗？",
    you_will_be_redirected_to_login_page: "您将会回到登录⻚⾯。",
    cancel: "取消",
    ok_capital: "确定",
    please_select_university_and_course: "请选择大学和课程。",

    // Results -> index.js
    class_name: "班级名称",
    result_small: "结果",
    yet_to_be_graded: "尚待评分",
    no_results: "没有结果",

    // Profile -> edit.js
    full_name: "全名",
    email: "电子邮件",
    username: "用户名",
    education: "教育",
    university: "大学",
    search_university: "搜索大学",
    course: "课程",
    search_course: "搜索课程",
    password: "密码",
    edit_capital: "编辑",

    // Resource Purchase
    please_purchase_the_complete_paper_to_full_pages: "请购买完整的论文到整页",

    // Homework Grading.js
    are_you_sure_you_want_to_submit_grade_alert: "您确定要提交成绩吗？",

    // HomeworkGraded.js
    graded_homework: "分级作业",

    // HomeworkChat.js
    answers_capital: "答案",

    // Alert Modal Component
    are_you_sure_you_want_to_delete_this: "你确定要删除这个吗?",
    yes_capital: "是的",
    no_capital: "不",

    // QuestionCard.js Component
    time_remaining: "剩余时间",

    // contact-us
    email_capital: "电子邮件",
    message_capital: "信息",
    send_message: "发信息",
    please_enter_all_the_fields: "请输入所有字段！",
    message_sent_successfully: "短信成功发送",
    error_string: "错误:",

    // Subscription
    active: "积极的",
    inactive: "不活动",
    subscription_started_date: "订阅开始日期",
    next_subscription_renewal_date: "下一个订阅续订日期",
    RMB_for_1_month: "15元1个月",
    RMB_for_6_month: "75 元 6 个月",
    RMB_for_12_month: "120 元 12 个月",
    subscription_already_active: "订阅已激活",
    use_my_wallet_balance: "使用我的钱包余额",
    use_wechat_pay: "使用微信支付",

    // POST QUESTION
    provide_title: '提供标题',

    // Wallet
    insufficient_amount_in_wallet_alert: '钱包金额不足，请充值或使用微信支付',
    
    // push notif
    notif_1: "用户名}你的问题正在处理",
    notif_2: "用户名}您的作业{ homework _ name }正在批改{ grade _ number}",
    notif_3: " { Username }给您发送消息{ question _ title }",
    notif_4: " { Username }购买了您的文章{ resource _ name }  ",
    notif_5: " { Username }购买了您的课件{ lesson _ plan }  ",
    notif_6: " {用户名}您已成功充值  ",
    notif_7: "{ Username }您的钱包已扣除{ amount }元 ",
    notif_8: "{用户名}您的问题{ question _ name }已成功提出  ",
    notif_9: " {用户名}您的金额{金额}元将按顺序{顺序 _ 类型}-{问题 _ 标题}退款  ",
    notif_10: " {用户名}您已成功购买文章{资源 _ 名称} ，{金额}元。请立即下载{资源 _ 名称} ",
    notif_11: "{ Username }您已成功购买课件{ lesson _ plan _ name } ，{ amount }元。请立即下载{ lesson _ plan _ name }  ",
    notif_12: "{ Username }您的帐户将扣除{ amount }元",
  },

  English: {
    back: "Back",
    welcome: "Welcome to our application",
    login_subheading: "Login here to get access",
    forgot_subheading: "Forgot your password",
    register_subheading: "Register here to get access",
    forgot_password: "Forgot Password?",
    login_capital: "LOGIN",
    submit: "SUBMIT",
    register_here: "Register here",
    new_user: "New User?",
    email_label: "EMAIL ID",
    username_or_email_label: "USERNAME OR EMAIL ID",
    password_label: "ENTER PASSWORD",
    password_placeholder: "ENTER PASSWORD",
    email_placeholder: "user@email.com",
    signup_capital: "REGISTER",
    enter_full_name: "ENTER FULL NAME",
    enter_username: "ENTER USERNAME",
    enter_std: "STUDENT NUMBER",
    select_university: "SELECT YOUR UNIVERSITY",
    select_course: "SELECT YOUR COURSE",
    refferral_code_label: "REFERRAL CODE",
    enter_referral_code: "ENTER REFERRAL CODE",
    subscriptions: "Subscriptions",
    //register
    you_are_a: "YOU ARE A",
    student: "Student",
    teacher: "Teacher",
    you: "You",
    at: "AT",
    by_clicking_register: "By clicking Register, you agree to our",
    terms_data_policy: "Terms Data Policy",

    // home
    good_morning: "Good Morning",
    good_evening: "Good Evening",
    top_3_performers:
      "Top 3 performers each month can win, 300, 200, 100 rmb respectively",
    performers: "Performers",

    // my classes
    my_classes: "My Classes",

    // questions
    open_questions: "Open Questions",
    no_open_questions_found: "No open question found",

    // drawer
    home: "Home",
    forums: "Forums",
    notifications: "Notifications",
    classes: "Classes",
    earn_points: "Earn Points",
    lesson_plans: "Lesson Plans",
    resources: "Resources",
    send_referral_link: "Send Referral Link",
    results: "Results",
    wallet: "Wallet",
    contact_us: "Contact us",
    help_guide: "Help guide",
    log_out: "Log Out",
    view_account: "View Account",

    // contact us
    send_us_an_email_message_text:
      "Send us an Email and we will get back to you as soon as possible",

    // Earn Points
    invite_teacher_student: "Invite teacher & student",
    remember_the_more_teachers_and_students:
      "Remember the more teachers and students",
    on_the_platform_the_more_chances_you:
      "on the platform, the more chances you",
    have_of_making_money_and_points: "have of making money and points",
    points_for_a_students: "50 points for a students",
    points_for_a_teacher: "100 points for a teacher",
    your_referral_link: "Your Referral link",
    referrals: "Referrals",
    points_from_referrals: "Points from Referrals",

    // Post Questions:
    write_your_questions: "WRITE YOUR QUESTIONS",
    your_question_will_be_posted_to_portal_on_success:
      "Your question will be posted to portal on success.",
    RMB: "RMB",
    total_price: "Total Price",
    price_platform_fee: "(Price + 10% Platform fee)",
    summary: "Summary",
    question: "Question",
    subject: "Subject",
    post_capital: "POST",

    // Ask A Question Row
    ask_a_new_question_capital: "ASK A NEW QUESTION",
    ask_a_new_question: "Ask a new question",

    // CurrentQuestions.js
    closed_questions: "Closed Questions",
    no_close_question_found: "No close question found",

    // Write Your Question
    category: "Category",
    ask_who: "Ask who",
    type_of_question: "Type of Question",
    normal_question: "Normal Question",
    academic_english: "Academic English",

    // Question Length
    for_students_questions: "For students questions:",
    for_teachers_questions: "For teachers questions:",
    you_cant_put_bid_less_than_recommended_amount:
      "You can't put Bid less than recommended amount.",
    price_list: "Price List",
    platform_fee: "(plus 10% platform fee)",
    question_type: "Question Type",
    your_remaining_free_question_is: "Your remaining free question is",
    we_cannot_guarantee_these_questions_will_be_answered:
      "(we cannot guarantee these questions will be answered)",
    short_question: "Short Question",
    long_question: "Long Question",
    time_limit: "Time Limit",
    price: "Price",

    // Performance Card
    view_all_capital: "VIEW ALL",
    points_capital: "POINTS",
    points: "Points",
    position: "Position",
    questions_answered: "Questions Answered",
    resources_created: "Resources Created",

    // Resources + AddResources.js
    resources_by_others: "Resources By Others",
    my_resources: "My Resources",
    open: "Open",
    primary_school: "Primary School",
    middle_school: "Middle School",
    high_school: "High School",
    under_graduate: "Under Graduate",
    post_graduate: "Post Graduate",
    grades: "Grades",
    paper_demo_before_purchase: "Paper Demo before purchase",

    // Wallet
    balance: "Balance",
    withdraw: "Withdraw",
    topup: "Topup",
    transactions: "Transactions",
    transaction: "Transaction",
    student_id: "Student ID",
    issue_refund: "Issue Refund",
    are_you_sure: "Are you sure?",
    the_amount_will_be_refunded_to_the_student:
      "The amount will be refunded to the student",
    return: "Return",
    credit_card_number_capital: "CREDIT CARD NUMBER",
    name_capital: "NAME",
    cvv_capital: "CVV",
    country_capital: "COUNTRY",
    expiry_capital: "EXPIRY",
    topup_amount_capital: "TOPUP AMOUNT",
    top_up: "Top up",

    // Classes
    add_class_capital: "ADD CLASS",
    enroll_in_a_class: "Enroll in a Class",
    or: "or",
    scan_a_qr_code_capital: "SCAN A QR CODE",
    create_a_class: "Create a Class",

    // My Classes.js
    no_classes_found: "No classes found",

    // HomeworkChat
    leave_this_question:
      "You will no longer be able to answer this question. Do you want to leave this question?",
    leave_question: "Leave Question",

    // HomeworkInformation.js
    read_full: "READ FULL",
    read_less: "READ LESS",
    grade: "Grade",
    view: "View",
    due_date: "Due date",
    submissions: "Submissions",
    instructions: "Instructions",
    title: "title",
    description: "Description",

    // HomeworkGrading.js
    grading_homework: "Grading Homework",

    // Homework Create
    title_capital: "TITLE",
    description_capital: "DESCRIPTION",
    deadline_date_capital: "DEADLINE DATE",
    deadline_time_capital: "DEADLINE TIME",
    overtime_capital: "OVERTIME",
    overtime_alert: "We Cannot set a Deadline time greater than overtime.",
    missing_values_alert: "Missing Values",
    description_missing_alert: "Description is missing.",
    title_missing_alert: "Title is missing.",
    select_your_course: "Select your course",
    create_a_homework: "Create a homework",
    create_a_homework_capital: "CREATE A HOMEWORK",

    // EnrollStudentModal
    enroll_student: "Enroll Student",
    student_username_email: "STUDENT USERNAME / EMAIL",
    or_capital: "OR",
    share_qr_code_with_students: "Share QR code with the students",
    enroll_student_capital: "ENROLL STUDENT",

    // BOTTOM TAB BAR // TOP HEADER
    dashboard: "Dashboard",
    forum: "论坛",
    home: "Home",

    // Profile -> Edit.js
    profile_picture: "Profile picture", // 个人资料图片,

    // Loader Component Spinner
    please_wait_loader: "Please wait...", //

    // Welcome
    continue_using_wechat: "CONTINUE USING WECHAT",

    // ClassFacePiles.js
    students: "Students",
    currently_enrolled: "Currently Enrolled",
    no_students_currently_enrolled: "No Students Currently Enrolled",

    // TextEditor.js
    start_writing_here: "Start Writing Here",
    wordcount: "Wordcount",

    // Card.js
    view_more: "View more",
    view_less: "View less",
    days_left: " days left",
    todays: "Todays",
    result_capital: "RESULT",
    view_capital: "VIEW",

    // MultiFunctionTextEditor
    download: "Download",
    save_capital: "SAVE",

    // LessonPlan and Resources Plan
    purchase_the_complete_paper: "Purchase the complete paper",
    pay: "Pay",
    service: "Service",
    cost: "Cost",
    resource: "Resource",
    total: "Total",
    search_paper: "Search Paper(e.g. Maths, Algebra)",
    lesson_plans_by_others: "Lesson Plans By Others",
    skill_capital: "SKILL",
    please_add_teachers_notes_if_required_capital:
      "PLEASE ADD TEACHERS NOTES IF REQUIRED",
    you_can_have_maximum_of_10_lesson_plan:
      "You can have a Maximum of 10 Lesson Plan",

    // AddResources
    education_level: "Education Level",
    subject_capital: "SUBJECT",
    no_of_page_to_show_as_sample: "NUMBER OF PAGE TO SHOW AS SAMPLE",
    grade_capital: "GRADE",
    price_capital: "PRICE",
    you_can_have_maximum_of_10_resources:
      "You can have a Maximum of 10 Resources",
    publish_capital: "PUBLISH",

    // navigation -> index.js
    view_all_performance: "View All Performance",
    my_lesson_plans: "My Lesson Plans",
    add_lesson_plans: "Add Lesson Plan",
    account: "Account",
    add_resource: "Add Resource",
    write_your_question: "Write Your Question",
    edit_question: "Edit Question",
    feedback: "Feedback",
    homework_chat: "Homework Chat",
    homework: "Homework",

    // Current Homework
    current_homework_capital: "CURRENT HOMEWORK",
    no_homeworks_today_capital: "NO HOMEWORKS TODAY",

    // Auth.js
    you_really_want_to_log_out: "You really want to logout?",
    you_will_be_redirected_to_login_page:
      "You will be redirected to login page.",
    cancel: "Cancel",
    ok_capital: "OK",
    please_select_university_and_course: "Please Select University and Course.",

    // Results -> index.js
    class_name: "Class name",
    result_small: "result",
    yet_to_be_graded: "Yet to be Graded",
    no_results: "No results",

    // Profile -> edit.js
    full_name: "Full Name",
    email: "Email",
    username: "Username",
    education: "Education",
    university: "University",
    search_university: "Search university",
    course: "Course",
    search_course: "Search course",
    password: "Password",
    edit_capital: "EDIT",

    // Resource Purchase
    please_purchase_the_complete_paper_to_full_pages:
      "Please Purchase The Complete Paper To Full Pages",

    // Homework Grading.js
    are_you_sure_you_want_to_submit_grade_alert:
      "Are you sure you want to submit grade?",

    // HomeworkGraded.js
    graded_homework: "Graded Homework",

    // HomeworkChat.js
    answers_capital: "ANSWERS",

    // Alert Modal Component
    are_you_sure_you_want_to_delete_this:
      "Are you sure you want to delete this?",
    yes_capital: "YES",
    no_capital: "NO",

    // QuestionCard.js Component
    time_remaining: "Time Remaining",

    // contact-us
    email_capital: "EMAIL",
    message_capital: "MESSAGE",
    send_message: "Send Message",
    please_enter_all_the_fields: "Please enter all the fields!",
    message_sent_successfully: "Message Sent Successfully",
    error_string: "Error:",

    // Subscription
    active: "Active",
    inactive: "Inactive",
    subscription_started_date: "Subscription Started Date",
    next_subscription_renewal_date: "Next Subscription Renewal Date",
    RMB_for_1_month: "15 RMB for 1 Month",
    RMB_for_6_month: "75 RMB for 6 Month",
    RMB_for_12_month: "120 RMB for 12 Month",
    subscription_already_active: "Subscription already Active",
    use_my_wallet_balance: "Use my wallet balance",
    use_wechat_pay: "Use WeChat Pay",

    // POST QUESTION
    provide_title: 'Provide Title',

    // Wallet
    insufficient_amount_in_wallet_alert: 'Insufficient amount in wallet, Please top-up or use wechat pay',

    // push notif
    notif_1: "You Question is accepted",
    notif_2: "Your homework {homework_name} has been graded {grade_number}",
    notif_3: "sent you message from {question_title}. ",
    notif_4: "purchased your resource {resource_name} ",
    notif_5: "purchased your lesson plan {lesson_plan} ",
    notif_6: "your wallet has been recharged successfully with amount {amount} ",
    notif_7: "The {amount} deducted from your wallet.",
    notif_8: "Your question {question_name} posted successfully. ",
    notif_9: "Your amount {amount} got refunded for order {order_type} - {question_title} ",
    notif_10: "Your purchased {resources_name}, of {amount} successfully. Download {resources_name} now! ",
    notif_11: "Your purchased {lesson_plan_name}, of {amount} successfully. Download {lesson_plan_name} now! ",
    notif_12: "The {amount} deducted from your we-chat account. ",

 
  },
});

export const changeLaguage = (languageKey) => {
  if (languageKey != null) {
    AsyncStorage.setItem("LocalizedStrings", languageKey);
    strings.setLanguage(languageKey);
  } else {
    strings.setLanguage("English");
  }
};
