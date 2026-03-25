/**
 * @name 价格监督检查统计表
 * 
 * 参考资料：
 * - /src/themes/antd-new/designToken.json (Ant Design 主题)
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex, Typography } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface PriceData {
    key: string;
    indicatorName: string;
    code: string | number;
    cases: number | string;
    largeFines: number | string;
    yoyCases: string;
    totalAmount: number | string;
    yoyAmount: string;
    refundAmount: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
}

const mockData: PriceData[] = [
    { key: 'h1', indicatorName: '甲', code: '乙', cases: 1, largeFines: 2, yoyCases: '3', totalAmount: '4', yoyAmount: '5', refundAmount: '6', fineAmount: '7', confiscatedAmount: '8' },
    { key: 'h2', indicatorName: '合计', code: '1', cases: 278, largeFines: 1, yoyCases: '-78.04%', totalAmount: 3373.975418, yoyAmount: '-57.56%', refundAmount: 73.356369, fineAmount: 801.932368, confiscatedAmount: 2498.686681 },
    { key: '1', indicatorName: '一、商品价格', code: '2', cases: 182, largeFines: 0, yoyCases: '-79.1%', totalAmount: 844.912458, yoyAmount: '-77.78%', refundAmount: 25.748189, fineAmount: 339.633985, confiscatedAmount: 279.532404 },
    { key: '1-1', indicatorName: '1.粮食等农产品', code: '3', cases: 4, largeFines: 0, yoyCases: '-91.3%', totalAmount: 0.172561, yoyAmount: '-97.33%', refundAmount: 0, fineAmount: 0.16, confiscatedAmount: 0.012561 },
    { key: '1-2', indicatorName: '2.化肥等农资', code: '4', cases: 0, largeFines: 0, yoyCases: '-100%', totalAmount: 0, yoyAmount: '-100%', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '1-3', indicatorName: '3.电力', code: '5', cases: 23, largeFines: 0, yoyCases: '-57.41%', totalAmount: 61.942706, yoyAmount: '-86.54%', refundAmount: 0.119469, fineAmount: 57.835931, confiscatedAmount: 3.987306 },
    { key: '1-4', indicatorName: '4.成品油、天然气', code: '6', cases: 9, largeFines: 0, yoyCases: '-74.29%', totalAmount: 56.904754, yoyAmount: '-84.38%', refundAmount: 1.566, fineAmount: 42.090263, confiscatedAmount: 13.248491 },
    { key: '1-5', indicatorName: '5.水', code: '7', cases: 5, largeFines: 0, yoyCases: '-92.65%', totalAmount: 75.78927, yoyAmount: '-66.27%', refundAmount: 0, fineAmount: 75.43771, confiscatedAmount: 0.35156 },
    { key: '1-6', indicatorName: '6.药品', code: '8', cases: 8, largeFines: 0, yoyCases: '-85.71%', totalAmount: 0.60491, yoyAmount: '-99.44%', refundAmount: 0.04, fineAmount: 0.49064, confiscatedAmount: 0.07427 },
    { key: '1-7', indicatorName: '7.房地产', code: '9', cases: 1, largeFines: 0, yoyCases: '-66.67%', totalAmount: 0, yoyAmount: '-100%', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '1-8', indicatorName: '8.其他', code: '10', cases: 132, largeFines: 0, yoyCases: '-78%', totalAmount: 449.498257, yoyAmount: '-78.88%', refundAmount: 24.0207, fineAmount: 163.619341, confiscatedAmount: 281.858216 },
    { key: '2', indicatorName: '二、服务价格', code: '11', cases: 86, largeFines: 1, yoyCases: '-73.46%', totalAmount: 2672.619052, yoyAmount: '-26.32%', refundAmount: 47.5998, fineAmount: 456.379748, confiscatedAmount: 2168.639304 },
    { key: '2-1', indicatorName: '1.交通运输', code: '12', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '2-1-1', indicatorName: '其中：铁路', code: '13', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '2-2', indicatorName: '2.邮政通信', code: '14', cases: 0, largeFines: 0, yoyCases: '-100%', totalAmount: 0, yoyAmount: '-100%', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '2-3', indicatorName: '3.教育', code: '15', cases: 2, largeFines: 0, yoyCases: '-85.71%', totalAmount: 4.10001, yoyAmount: '-99.27%', refundAmount: 0, fineAmount: 4.10001, confiscatedAmount: 0 },
    { key: '2-4', indicatorName: '4.医疗服务', code: '16', cases: 38, largeFines: 0, yoyCases: '-75%', totalAmount: 2063.500668, yoyAmount: '53.39%', refundAmount: 2.58663, fineAmount: 151.259426, confiscatedAmount: 1909.654612 },
    { key: '2-5', indicatorName: '5.物业管理', code: '17', cases: 8, largeFines: 0, yoyCases: '-33.33%', totalAmount: 53.210487, yoyAmount: '51.08%', refundAmount: 5.60184, fineAmount: 48.60109, confiscatedAmount: 0.007557 },
    { key: '2-6', indicatorName: '6.停车场服务', code: '18', cases: 2, largeFines: 0, yoyCases: '-60%', totalAmount: 15.2, yoyAmount: '917.47%', refundAmount: 0, fineAmount: 15.2, confiscatedAmount: 0 },
    { key: '2-7', indicatorName: '7.社会中介机构服务', code: '19', cases: 0, largeFines: 0, yoyCases: '-100%', totalAmount: 0, yoyAmount: '-100%', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '2-8', indicatorName: '8.金融', code: '20', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '2-9', indicatorName: '9.旅游', code: '21', cases: 4, largeFines: 0, yoyCases: '100%', totalAmount: 21.72898, yoyAmount: '81.83%', refundAmount: 0, fineAmount: 14.44014, confiscatedAmount: 7.28884 },
    { key: '2-10', indicatorName: '10.其他', code: '22', cases: 32, largeFines: 1, yoyCases: '-76.64%', totalAmount: 512.878907, yoyAmount: '-69.29%', refundAmount: 38.41133, fineAmount: 222.779082, confiscatedAmount: 251.688495 },
    { key: '3', indicatorName: '三、国家机关（含下属事业单位）收费', code: '23', cases: 10, largeFines: 0, yoyCases: '-80.39%', totalAmount: 56.443906, yoyAmount: '-94.6%', refundAmount: 0.0104, fineAmount: 5.918735, confiscatedAmount: 50.514773 },
    { key: '3-1', indicatorName: '1.公安部门', code: '24', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-2', indicatorName: '2.自然资源部门', code: '25', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-3', indicatorName: '3.住房城乡建设部门', code: '26', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-4', indicatorName: '4.交通运输部门', code: '27', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-5', indicatorName: '5.工业和信息化部门', code: '28', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-6', indicatorName: '6.农业农村部门', code: '29', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '3-7', indicatorName: '7.卫生健康部门', code: '30', cases: 3, largeFines: 0, yoyCases: '-78.57%', totalAmount: 1.281371, yoyAmount: '-94.65%', refundAmount: 0.0104, fineAmount: 0.661704, confiscatedAmount: 0.609267 },
    { key: '3-8', indicatorName: '8.药品监管部门', code: '31', cases: 0, largeFines: 0, yoyCases: '-', totalAmount: 0, yoyAmount: '-', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '4', indicatorName: '四、价格违法行为', code: '35', cases: 249, largeFines: 1, yoyCases: '-78.27%', totalAmount: 3345.948133, yoyAmount: '-54.65%', refundAmount: 73.356369, fineAmount: 774.925828, confiscatedAmount: 2497.665936 },
    { key: '4-1', indicatorName: '1.违反明码标价规定行为', code: '36', cases: 92, largeFines: 0, yoyCases: '-83.36%', totalAmount: 14.702791, yoyAmount: '-87.19%', refundAmount: 1.27, fineAmount: 5.82625, confiscatedAmount: 7.606541 },
    { key: '4-2', indicatorName: '2.不正常价格行为', code: '37', cases: 39, largeFines: 0, yoyCases: '-77.46%', totalAmount: 284.71627, yoyAmount: '-43.27%', refundAmount: 37.89133, fineAmount: 110.117375, confiscatedAmount: 136.707565 },
    { key: '4-2-1', indicatorName: '(1) 价格串通行为', code: '38', cases: 0, largeFines: 0, yoyCases: '-100%', totalAmount: 0, yoyAmount: '-100%', refundAmount: 0, fineAmount: 0, confiscatedAmount: 0 },
    { key: '4-2-3', indicatorName: '(3) 哄抬价格行为', code: '40', cases: 3, largeFines: 0, yoyCases: '0%', totalAmount: 2.090611, yoyAmount: '461.85%', refundAmount: 0, fineAmount: 1.144503, confiscatedAmount: 0.946108 },
    { key: '4-2-4', indicatorName: '(4) 价格欺诈行为', code: '41', cases: 17, largeFines: 0, yoyCases: '-81.52%', totalAmount: 3.777009, yoyAmount: '-95.1%', refundAmount: 0, fineAmount: 3.554194, confiscatedAmount: 0.222815 },
    { key: '4-3', indicatorName: '3.不执行政府定价、政府指导价; 不执行法定价格干预措施、应急措施', code: '46', cases: 118, largeFines: 1, yoyCases: '-71.9%', totalAmount: 3046.529072, yoyAmount: '-55.41%', refundAmount: 34.195039, fineAmount: 658.982203, confiscatedAmount: 2353.35183 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<PriceData>['columns'] = [
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 320,
            render: (text) => {
                const isHeading = ['一、', '二、', '三、', '四、'].some(prefix => text.startsWith(prefix));
                const isSubHeading = /^\d+\./.test(text);
                const isDeepSubHeading = text.startsWith('其中：') || text.startsWith('(');
                const isSpecial = text === '甲' || text === '合计';

                let paddingLeft = 12;
                if (isHeading) paddingLeft = 12;
                else if (isSubHeading) paddingLeft = 24;
                else if (isDeepSubHeading) paddingLeft = 36;
                else if (isSpecial) paddingLeft = 12;

                return (
                    <div style={{
                        paddingLeft,
                        fontWeight: isHeading || isSpecial ? 600 : 400,
                        color: isHeading || isSpecial ? '#111827' : '#4b5563',
                        textAlign: isSpecial ? 'center' : 'left'
                    }}>
                        {text}
                    </div>
                );
            }
        },
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 60,
        },
        {
            title: '件数 (件)',
            dataIndex: 'cases',
            key: 'cases',
            align: 'center',
            render: (text, record) => {
                if (record.key === 'h1') return text;
                return <span style={{ color: '#2563eb', cursor: 'pointer' }}>{text}</span>
            }
        },
        {
            title: '罚款金额百万元以上案件',
            dataIndex: 'largeFines',
            key: 'largeFines',
            align: 'center',
            render: (text, record) => {
                if (record.key === 'h1') return text;
                return <span style={{ color: '#2563eb', cursor: 'pointer' }}>{text}</span>
            }
        },
        {
            title: '同比 (%)',
            dataIndex: 'yoyCases',
            key: 'yoyCases',
            align: 'center',
        },
        {
            title: '总金额 (万元)',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'center',
        },
        {
            title: '同比 (%)',
            dataIndex: 'yoyAmount',
            key: 'yoyAmount',
            align: 'center',
        },
        {
            title: '退还用户金额 (万元)',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            align: 'center',
        },
        {
            title: '罚款金额 (万元)',
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
        },
        {
            title: '没收金额 (万元)',
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
        },
    ];

    return (
        <div className="page-container">
            <div className="content-wrapper">
                <Title level={2} className="page-title">价格监督检查统计表</Title>

                <Flex justify="space-between" align="center" className="filter-bar">
                    <Flex gap={24} align="center">
                        <Flex gap={8} align="center">
                            <span className="filter-label">办案机构：</span>
                            <Cascader 
                                style={{ width: 240 }} 
                                placeholder="请选择办案机构" 
                                options={agencyData} 
                                changeOnSelect
                                allowClear
                                showSearch={{ filter: (inputValue, path) => path.some(option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }}
                            />
                        </Flex>
                        <Flex gap={8} align="center">
                            <span className="filter-label">日期范围：</span>
                            <RangePicker style={{ width: 280 }} />
                        </Flex>
                        <Radio.Group value={reportType} onChange={e => setReportType(e.target.value)}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>
                    <Flex gap={12}>
                        <Button type="primary" icon={<SearchOutlined />} className="btn-primary">查询</Button>
                        <Button icon={<ExportOutlined />}>导出</Button>
                    </Flex>
                </Flex>

                <div className="table-container">
                    <Table
                        columns={columns}
                        dataSource={mockData}
                        pagination={false}
                        bordered
                        size="middle"
                        rowClassName={(record) => record.key.startsWith('h') ? 'table-header-row' : ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
