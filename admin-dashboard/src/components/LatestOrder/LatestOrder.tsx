import React from 'react';
import './LatestOrder.css';

const LatestOrders: React.FC = () => {
    return (
        <div className="latest-orders">
            <h3>Đơn hàng mới</h3>
            <table>
                <thead>
                    <tr>
                        <th>Tên khách hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Giỏ hàng</th>
                        <th>Giá</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>2024-05-25</td>
                        <td>3 items</td>
                        <td>$300</td>
                        <td><button>Chi tiết</button></td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>2024-05-24</td>
                        <td>2 items</td>
                        <td>$200</td>
                        <td><button>Chi tiết</button></td>
                    </tr>
                    <tr>
                        <td>Mike Johnson</td>
                        <td>2024-05-23</td>
                        <td>1 item</td>
                        <td>$100</td>
                        <td><button>Chi tiết</button></td>
                    </tr>
                    <tr>
                        <td>Alice Brown</td>
                        <td>2024-05-22</td>
                        <td>4 items</td>
                        <td>$400</td>
                        <td><button>Chi tiết</button></td>
                    </tr>
                </tbody>
            </table>
            <p><a href="#" id="view-orders-link">Xem tất cả đơn hàng</a></p>
        </div>
    );
};

export default LatestOrders;
