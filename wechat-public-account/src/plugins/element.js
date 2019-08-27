import Vue from "vue";
import {
    Container,
    Aside,
    Main,
    Tree,
    Header,
    Footer,
    Col,
    Row,
    Menu,
    MenuItem,
    Input,
    Button,
    Table,
    TableColumn,
    Pagination,
    Select,
    Option,
    Dialog,
    Card,
    Upload,
    Message,    
    MessageBox,
    Carousel,
    CarouselItem,
    Tooltip,
    Switch,
    DatePicker,
    Form,
    FormItem,
    Collapse,
    CollapseItem,
    Breadcrumb,
    BreadcrumbItem,
    Checkbox,
    CheckboxGroup,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Notification,
    Loading
  
} from 'element-ui';
Vue.use(Container)
    .use(Aside)
    .use(Main)
    .use(Tree)
    .use(Header)
    .use(Footer)
    .use(Col)
    .use(Row)
    .use(Menu)
    .use(MenuItem)
    .use(Input)
    .use(Button)
    .use(Table)
    .use(TableColumn)
    .use(Pagination)
    .use(Select)
    .use(Option)
    .use(Dialog)
    .use(Upload)
    .use(Card)
    .use(Carousel)
    .use(CarouselItem)
    .use(Tooltip)
    .use(Switch)
    .use(DatePicker)
    .use(Form)
    .use(FormItem)
    .use(Collapse)
    .use(CollapseItem)
    .use(Breadcrumb)
    .use(BreadcrumbItem)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Dropdown)
    .use(DropdownItem)
    .use(DropdownMenu)
    
;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$notify =Notification;
Vue.prototype.$loading = Loading.service;