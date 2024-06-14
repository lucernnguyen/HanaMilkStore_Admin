import React from 'react';
import './NewCustomer.css';

const NewCustomers: React.FC = () => {
    return (
        <div className="new-customers">
            <h3>Khách hàng mới</h3>
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Ngày tạo</th>
                        <th>Icon</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jane Smith</td>
                        <td>2024-05-25</td>
                        <td><img src="path/to/icon.png" alt="Icon" className="icon" /></td>
                    </tr>
                    <tr>
                        <td>John Doe</td>
                        <td>2024-05-24</td>
                        <td><img src="path/to/icon.png" alt="Icon" className="icon" /></td>
                    </tr>
                    <tr>
                        <td>Alice Brown</td>
                        <td>2024-05-23</td>
                        <td><img src="path/to/icon.png" alt="Icon" className="icon" /></td>
                    </tr>
                    <tr>
                        <td>Mike Johnson</td>
                        <td>2024-05-22</td>
                        <td><img src="path/to/icon.png" alt="Icon" className="icon" /></td>
                    </tr>
                </tbody>
            </table>
            <p><a href="#" id="view-all-customers-link">Xem tất cả khách hàng</a></p>
        </div>
    );
};

export default NewCustomers;
