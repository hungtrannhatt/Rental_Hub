import classNames from 'classnames/bind';
import styles from './LoginUser.module.scss';
import Header from '../../Components/Header/Header';
import { Form, Input, Button, Tabs, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const cx = classNames.bind(styles);
const { TabPane } = Tabs;
const { Text } = Typography;

import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { requestLogin, requestLoginGoogle } from '../../config/request';

function LoginUser() {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await requestLogin(values);
            message.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const handleSuccess = async (response) => {
        // 1. Log ngay khi Google trả về kết quả (Để xem Popup có thành công ko)
        console.log("1. Google đã phản hồi:", response); 
        
        const { credential } = response;
        try {
            // 2. Log trước khi gọi API backend
            console.log("2. Bắt đầu gọi API Backend với token:", credential);
    
            const res = await requestLoginGoogle({ credential });
            
            // 3. Log sau khi API trả về (Cái bạn đang mong chờ)
            console.log("3. Dữ liệu login trả về:", res);
    
            // ... code xử lý tiếp ...
        } catch (error) {
            // 4. Log nếu bị lỗi
            console.error("4. LỖI XẢY RA:", error);
        }
    };

    useEffect(() => {
        document.title = 'Đăng nhập';
    }, []);

    return (
        <div className={cx('wrapper')}>
            <header>
                <Header />
            </header>

            <main className={cx('main')}>
                <div className={cx('login-container')}>
                    <Tabs defaultActiveKey="1" centered className={cx('login-tabs')}>
                        <TabPane tab="Đăng nhập" key="1">
                            <Form form={form} name="login" className={cx('login-form')} onFinish={onFinish}>
                                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                    <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                                </Form.Item>
                                <div className={cx('footer')}>
                                    <Form.Item>
                                        <Link className={cx('forgot-password')} to="/register">
                                            Bạn chưa có tài khoản
                                        </Link>
                                    </Form.Item>

                                    <Form.Item>
                                        <Link className={cx('forgot-password')} to="/forgot-password">
                                            Bạn quên mật khẩu?
                                        </Link>
                                    </Form.Item>
                                </div>

                                <Form.Item>
                                    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                                        <GoogleLogin
                                            onSuccess={handleSuccess}
                                            onError={() => console.log('Login Failed')}
                                        />
                                    </GoogleOAuthProvider>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className={cx('login-button')}
                                        block
                                        size="large"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>

                                <div className={cx('terms')}>
                                    <Text>
                                        Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các{' '}
                                        <Link href="#">quy định sử dụng</Link> cũng như{' '}
                                        <Link href="#">chính sách bảo mật</Link> của chúng tôi
                                    </Text>
                                </div>
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default LoginUser;
