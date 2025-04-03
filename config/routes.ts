// import AppointmentScheduler from '@/components/ServiceManagementComponent/AppointmentScheduler';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todolist',
		name: 'Todolist',
		component: './Todolist/Todolist',
		icon: 'UnorderedListOutlined',
	},
	{
		path: '/guess-number',
		name: 'GuessNumber',
		component: './GuessNumber/GuessNumber',
		icon: 'FieldNumberOutlined',
	},
	{
		path: '/subject-management',
		name: 'SubjectMangement',
		component: './SubjectMangement/SubjectMangement',
		icon: 'BookOutlined',
	},
	{
		path: '/rock-paper-scissors',
		name: 'Rock-Paper-Scissors',
		component: './Rock_Paper_Scissors_Game/rock_paper_scissors_game',
		icon: 'ScissorOutlined',
	},
	{
		path: '/question-bank',
		name: 'QuestionBank',
		component: './QuestionBank/QuestionManagementMain',
		icon: 'QuestionCircleOutlined',
	},

	// {
	// 	path: '/service-management/appointment-management',
	// 	name: 'Appointment',
	// 	component: '@/components/ServiceManagementComponent/AppointmentScheduler',
	// 	icon: 'QuestionCircleOutlined',
	// },
	{
		path: '/service-management',
		name: 'ServiceManagement',
		// component: "./ServiceManagement/ServiceManagement",
		icon: 'QuestionCircleOutlined',
		routes: [
			{
				path: '/service-management/dash-board',
				name: 'Dash Board',
				component: './ServiceManagement/DashBoard',
			},
			{
				path: '/service-management/customer-management',
				name: 'Customer',
				component: './ServiceManagement/ServiceManagementComponent/CustomerManagement',
			},
			{
				path: '/service-management/service-management',
				name: 'Service',
				component: './ServiceManagement/ServiceManagementComponent/ServiceManagement',
			},
			{
				path: '/service-management/employee-management',
				name: 'Employee',
				component: './ServiceManagement/ServiceManagementComponent/EmployeeManagement',
			},
			{
				path: '/service-management/appointment-management',
				name: 'Appointment',
				// component: '@/components/ServiceManagementComponent/AppointmentScheduler',
				component: './ServiceManagement/ServiceManagementComponent/AppointmentManagement',
			},
			{
				path: '/service-management/review-responses',
				name: 'Review Responses',
				component: './ServiceManagement/ServiceManagementComponent/ReviewManagement',
			},
		],
	},

	{
		path: '/diploma-management',
		name: 'DipomaManagement',
		// component: "./DiplomaManagement/App",
		icon: 'QuestionCircleOutlined',
		routes: [
			{
				path: '/diploma-management/diplomabook-management/',
				name: 'Diploma Book',
				component: './DiplomaManagement/DiplomaBook',
			},
			{
				path: '/diploma-management/diploma-graduation-decision',
				name: 'Graduation Decision',
				component: './DiplomaManagement/GraduationDecisionManagement',
			},
			{
				path: '/diploma-management/diploma-information',
				name: 'Diploma Information',
				component: './DiplomaManagement/DiplomaInformationManagement',
			},

			{
				path: '/diploma-management/diploma-information-management',
				name: 'Field Template',
				component: './DiplomaManagement/DiplomaFieldTemplateManagement',
			},
			{
				path: '/diploma-management/diploma-lookup',
				name: 'Diploma Lookup',
				component: './DiplomaManagement/DiplomaLookup',
			},
		],
	},

	{
		path: '/classroom-management',
		name: 'Quản lý phòng học',
		// component: "./ClassRoomManagement",
		icon: 'InsertRowRightOutlined',
		routes: [
			{
				path: '/classroom-management/dashboard',
				name: 'Dash Board',
				component: './ClassRoomManagement/dashboard',
			},
			{
				path: '/classroom-management/classroom',
				name: 'Class Room',
				component: './ClassRoomManagement',
			},
			{
				path: '/classroom-management/1',
				name: 'Un Available',
				// component: "./DiplomaManagement/DiplomaInformationManagement",
			},

			{
				path: '/classroom-management/2',
				name: 'Un Available',
				// component: "./DiplomaManagement/DiplomaFieldTemplateManagement",
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
