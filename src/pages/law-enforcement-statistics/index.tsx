/**
 * @name 执法稽查办案统计表
 * 
 * 参考资料：
 * - /rules/development-standards.md
 * - 图片：查询条件设计、表格结构设计
 */

import React, { useState } from 'react';
import { Select, DatePicker, Radio, Button, Table, Cascader } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { agencyData } from './agencyData';
import './style.css';

const { RangePicker } = DatePicker;

// 定义表格数据结构
interface StatutoryData {
    key: string;
    indicatorName: string;
    code: string | number;
    totalCases: number;
    normalProcedure: number;
    caseValue: number | string;
    fineAmount: number;
    confiscatedAmount: number;
    transferredCases: number;
    isTotal?: boolean;
}

const mockData: StatutoryData[] = [
    { key: '1', indicatorName: '甲', code: '乙', totalCases: 1, normalProcedure: 2, caseValue: 3, fineAmount: 4, confiscatedAmount: 5, transferredCases: 6, isTotal: true },
    { key: '2', indicatorName: '合计', code: '1', totalCases: 4606, normalProcedure: 4375, caseValue: '1734.198077', fineAmount: 1258.578855, confiscatedAmount: 488.219822, transferredCases: 15, isTotal: true },
    { key: '3', indicatorName: '一、标准化违法案件', code: '2', totalCases: 58, normalProcedure: 57, caseValue: '5.360464', fineAmount: 5.122274, confiscatedAmount: 0.23819, transferredCases: 0 },
    { key: '4', indicatorName: '二、认证认可与检验检测违法案件', code: '3', totalCases: 59, normalProcedure: 55, caseValue: '50.72521', fineAmount: 43.611043, confiscatedAmount: 7.114167, transferredCases: 0 },
    { key: '5', indicatorName: '三、计量违法案件', code: '4', totalCases: 93, normalProcedure: 87, caseValue: '30.150317', fineAmount: 11.57072, confiscatedAmount: 18.579597, transferredCases: 1 },
    { key: '6', indicatorName: '其中：加油机作弊违法案件', code: '5', totalCases: 2, normalProcedure: 2, caseValue: '17.588125', fineAmount: 0.21, confiscatedAmount: 17.378125, transferredCases: 1 },
    { key: '7', indicatorName: '四、质量违法案件', code: '6', totalCases: 623, normalProcedure: 611, caseValue: '310.780271', fineAmount: 255.885159, confiscatedAmount: 54.895112, transferredCases: 2 },
    { key: '8', indicatorName: '五、侵害消费者权益案件', code: '7', totalCases: 40, normalProcedure: 32, caseValue: '37.170634', fineAmount: 14.493904, confiscatedAmount: 22.67673, transferredCases: 1 },
    { key: '9', indicatorName: '六、合同违法案件', code: '8', totalCases: 23, normalProcedure: 22, caseValue: '-', fineAmount: 12.65184, confiscatedAmount: 0.03184, transferredCases: 0 },
    { key: '10', indicatorName: '七、拍卖违法案件', code: '9', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '11', indicatorName: '八、知识产权案件', code: '10', totalCases: 158, normalProcedure: 158, caseValue: '403.586522', fineAmount: 143.655438, confiscatedAmount: 259.931084, transferredCases: 4 },
    { key: '12', indicatorName: '九、食品安全违法案件', code: '11', totalCases: 3351, normalProcedure: 3193, caseValue: '822.916538', fineAmount: 700.689601, confiscatedAmount: 122.227537, transferredCases: 6 },
    { key: '13', indicatorName: '十、军服违法案件', code: '12', totalCases: 1, normalProcedure: 1, caseValue: '0.1', fineAmount: 0.1, confiscatedAmount: 0, transferredCases: 0 },
    { key: '14', indicatorName: '十一、非法卫星电视地面接收设施及网络共享设备产品案件', code: '13', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '15', indicatorName: '十二、非法出版物案件', code: '14', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '16', indicatorName: '其中：政治性非法出版物案件', code: '15', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '17', indicatorName: '涉黄出版物案件', code: '16', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '18', indicatorName: '十三、政治性敏感商品案件', code: '17', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '19', indicatorName: '十四、无合法来源证明进口商品案件', code: '18', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '20', indicatorName: '十五、商品过度包装案件', code: '19', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '21', indicatorName: '其中：茶叶过度包装案件', code: '20', totalCases: 0, normalProcedure: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '22', indicatorName: '十六、违反市场主体登记管理法规案件', code: '21', totalCases: 117, normalProcedure: 87, caseValue: '-', fineAmount: 26.21, confiscatedAmount: 1.588991, transferredCases: 0 },
    { key: '23', indicatorName: '十七、其他案件', code: '22', totalCases: 83, normalProcedure: 72, caseValue: '45.52545', fineAmount: 44.588876, confiscatedAmount: 0.936574, transferredCases: 1 },
    { key: '24', indicatorName: '补充资料', code: '23', totalCases: '不予行政处罚案件' as any, normalProcedure: 1470, caseValue: '件' as any, fineAmount: '' as any, confiscatedAmount: '' as any, transferredCases: '' as any, isTotal: true },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<StatutoryData>['columns'] = [
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 280,
            render: (text) => {
                if (text === '甲' || text === '合计' || text === '补充资料') {
                    return <span className="font-semibold text-gray-900">{text}</span>;
                }
                if (text.startsWith('其中：') || text.startsWith('涉黄')) {
                    return <span className="pl-6 text-gray-600">{text}</span>;
                }
                return <span className="text-gray-800">{text}</span>;
            },
        },
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 80,
        },
        {
            title: '案件总数（件）',
            key: 'cases',
            children: [
                {
                    title: '', // Empty sub-header for the total to align with totalCases
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    render: (val, record) => <span className={record.isTotal ? 'text-gray-900 font-medium' : 'text-blue-500 cursor-pointer'}>{val}</span>,
                },
                {
                    title: <span className="text-gray-500 text-xs font-normal">普通程序</span>,
                    dataIndex: 'normalProcedure',
                    key: 'normalProcedure',
                    align: 'center',
                    render: (val, record) => <span className={record.isTotal ? 'text-gray-900 font-medium' : 'text-blue-500 cursor-pointer'}>{val}</span>,
                },
            ],
        },
        {
            title: '案值（万元）',
            dataIndex: 'caseValue',
            key: 'caseValue',
            align: 'center',
        },
        {
            title: '罚款金额（万元）',
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
        },
        {
            title: '没收金额（万元）',
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
        },
        {
            title: '移送司法机关案件（件）',
            dataIndex: 'transferredCases',
            key: 'transferredCases',
            align: 'center',
            render: (val, record) => <span className={record.isTotal ? 'text-gray-900 font-medium' : 'text-blue-500 cursor-pointer'}>{val}</span>,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* 标题 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-8 mt-2">执法稽查办案统计表</h1>

            {/* 搜索栏 */}
            <div className="w-full max-w-[1400px] mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">办案机构：</span>
                    <Cascader
                        className="w-64"
                        placeholder="请选择办案机构"
                        options={agencyData}
                        changeOnSelect
                        allowClear
                        showSearch={{ filter: (inputValue, path) => path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">处罚决定日期：</span>
                    <RangePicker className="w-[280px]" placeholder={['开始日期', '结束日期']} />
                </div>

                <div className="flex items-center gap-4 flex-1">
                    <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType} className="flex gap-4">
                        <Radio value="monthly">月报</Radio>
                        <Radio value="q1">一季报</Radio>
                        <Radio value="q2">二季报</Radio>
                        <Radio value="q3">三季报</Radio>
                        <Radio value="yearly">年报</Radio>
                    </Radio.Group>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600">查询</Button>
                    <Button icon={<ExportOutlined />}>导出</Button>
                </div>
            </div>

            {/* 表格容器 */}
            <div className="w-full max-w-[1400px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <Table
                    dataSource={mockData}
                    columns={columns}
                    pagination={false}
                    bordered
                    size="middle"
                    rowClassName={(record) => record.isTotal ? 'bg-gray-50' : 'hover:bg-blue-50 transition-colors'}
                    className="ant-table-striped"
                />
            </div>
        </div>
    );
};

export default Component;
