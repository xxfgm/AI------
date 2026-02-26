/**
 * @name 质量监督抽查统计表
 * 
 * 参考资料：
 * - /rules/development-standards.md
 * - 图片：查询条件设计（图1风格）、表格结构设计（图2内容）
 */

import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

// 定义表格数据结构
interface QualityData {
    key: string;
    seq?: string | number;
    indicatorName: string;
    code: string | number;
    enterprises: number | string;
    batches: number | string;
    valueAmount: number | string;
    qualifiedValue: number | string;
    unqualifiedValue: number | string;
    transferredCases: number | string;
}

const mockData: QualityData[] = [
    { key: '0', seq: '1', indicatorName: '甲', code: '乙', enterprises: 1, batches: 2, valueAmount: 3, qualifiedValue: 4, unqualifiedValue: 5, transferredCases: 6 },
    { key: '1', seq: '2', indicatorName: '合计', code: '1', enterprises: 659, batches: 667, valueAmount: '313.882371', qualifiedValue: '260.052163', unqualifiedValue: '53.830208', transferredCases: 2 },
    { key: '2', seq: '3', indicatorName: '一、农业生产资料', code: '2', enterprises: 37, batches: 35, valueAmount: '35.603099', qualifiedValue: '31.35923', unqualifiedValue: '4.243869', transferredCases: 0 },
    { key: '3', seq: '4', indicatorName: '其中：化学肥料', code: '3', enterprises: 24, batches: 23, valueAmount: '31.111899', qualifiedValue: '18.892994', unqualifiedValue: '12.218905', transferredCases: 0 },
    { key: '4', seq: '5', indicatorName: '农药', code: '4', enterprises: 1, batches: 1, valueAmount: '0.008', qualifiedValue: '0.04', unqualifiedValue: '-0.032', transferredCases: 0 },
    { key: '5', seq: '6', indicatorName: '农业机械', code: '5', enterprises: 0, batches: 0, valueAmount: '0', qualifiedValue: '0', unqualifiedValue: '0', transferredCases: 0 },
    { key: '6', seq: '7', indicatorName: '二、建筑材料', code: '6', enterprises: 56, batches: 56, valueAmount: '25.075481', qualifiedValue: '19.493888', unqualifiedValue: '5.581593', transferredCases: 0 },
    { key: '7', seq: '8', indicatorName: '其中：建筑用钢材', code: '7', enterprises: 4, batches: 4, valueAmount: '3.737', qualifiedValue: '2.3159', unqualifiedValue: '1.4211', transferredCases: 0 },
    { key: '8', seq: '9', indicatorName: '玻璃', code: '8', enterprises: 1, batches: 1, valueAmount: '0.7356', qualifiedValue: '0.08324', unqualifiedValue: '0.65236', transferredCases: 0 },
    { key: '9', seq: '10', indicatorName: '水泥', code: '9', enterprises: 1, batches: 1, valueAmount: '3.1', qualifiedValue: '0.9', unqualifiedValue: '2.2', transferredCases: 0 },
    { key: '10', seq: '11', indicatorName: '防水卷材', code: '10', enterprises: 11, batches: 11, valueAmount: '0.64043', qualifiedValue: '0.48543', unqualifiedValue: '0.155', transferredCases: 0 },
    { key: '11', seq: '12', indicatorName: '三、儿童用品', code: '11', enterprises: 37, batches: 37, valueAmount: '6.453305', qualifiedValue: '6.437983', unqualifiedValue: '0.015322', transferredCases: 0 },
    { key: '12', seq: '13', indicatorName: '其中：儿童玩具', code: '12', enterprises: 0, batches: 0, valueAmount: '0', qualifiedValue: '0', unqualifiedValue: '0', transferredCases: 0 },
    { key: '13', seq: '14', indicatorName: '其中：童车', code: '13', enterprises: 0, batches: 0, valueAmount: '0', qualifiedValue: '0', unqualifiedValue: '0', transferredCases: 0 },
    { key: '14', seq: '15', indicatorName: '儿童服装', code: '14', enterprises: 8, batches: 8, valueAmount: '2.500205', qualifiedValue: '2.302483', unqualifiedValue: '0.197722', transferredCases: 0 },
    { key: '15', seq: '16', indicatorName: '儿童鞋', code: '15', enterprises: 10, batches: 10, valueAmount: '1.417109', qualifiedValue: '1.140209', unqualifiedValue: '0.2769', transferredCases: 0 },
    { key: '16', seq: '17', indicatorName: '儿童安全座椅', code: '16', enterprises: 0, batches: 0, valueAmount: '0', qualifiedValue: '0', unqualifiedValue: '0', transferredCases: 0 },
    { key: '17', seq: '18', indicatorName: '儿童家具', code: '17', enterprises: 0, batches: 0, valueAmount: '0', qualifiedValue: '0', unqualifiedValue: '0', transferredCases: 0 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<QualityData>['columns'] = [
        {
            title: '序号',
            dataIndex: 'seq',
            key: 'seq',
            align: 'center',
            width: 70,
            render: (text) => <span className="text-gray-800">{text}</span>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 250,
            render: (text) => {
                if (text === '合计' || text === '甲' || text.startsWith('一、') || text.startsWith('二、') || text.startsWith('三、')) {
                    return <span className="font-medium text-gray-900">{text}</span>;
                }
                if (text.startsWith('其中：')) {
                    if (text === '其中：童车') {
                        return <span className="pl-12 text-gray-600">{text}</span>;
                    }
                    return <span className="pl-6 text-gray-600">{text}</span>;
                }
                return <span className="pl-6 text-gray-800">{text}</span>;
            },
        },
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 80,
            render: (text) => <span className="text-gray-800">{text}</span>
        },
        {
            title: <div className="text-center">累计抽查批数</div>,
            key: 'cumulative',
            children: [
                {
                    title: <span className="text-gray-600">企业数（家）<br /><span className="text-xs text-gray-400">1</span></span>,
                    dataIndex: 'enterprises',
                    key: 'enterprises',
                    align: 'center',
                    render: (val, record) => <span className={record.key === '0' || record.key === '1' ? 'text-gray-900' : 'text-blue-500 cursor-pointer'}>{val}</span>,
                },
                {
                    title: <span className="text-gray-600">批次数（批次）<br /><span className="text-xs text-gray-400">2</span></span>,
                    dataIndex: 'batches',
                    key: 'batches',
                    align: 'center',
                    render: (val, record) => <span className={record.key === '0' || record.key === '1' ? 'text-gray-900' : 'text-blue-500 cursor-pointer'}>{val}</span>,
                }
            ],
        },
        {
            title: <span className="text-gray-600">货值金额（万元）<br /><span className="text-xs text-gray-400">3</span></span>,
            dataIndex: 'valueAmount',
            key: 'valueAmount',
            align: 'center',
        },
        {
            title: <span className="text-gray-600">发现合格品货值（万元）<br /><span className="text-xs text-gray-400">4</span></span>,
            dataIndex: 'qualifiedValue',
            key: 'qualifiedValue',
            align: 'center',
        },
        {
            title: <span className="text-gray-600">发现不合格品货值（万元）<br /><span className="text-xs text-gray-400">5</span></span>,
            dataIndex: 'unqualifiedValue',
            key: 'unqualifiedValue',
            align: 'center',
        },
        {
            title: <span className="text-gray-600">移送司法机关案件（件）<br /><span className="text-xs text-gray-400">6</span></span>,
            dataIndex: 'transferredCases',
            key: 'transferredCases',
            align: 'center',
            render: (val, record) => <span className={record.key === '0' || record.key === '1' ? 'text-gray-900' : 'text-blue-500 cursor-pointer'}>{val}</span>,
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1600px] mx-auto">

                {/* 标题 */}
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>质量监督抽查统计表</h1>
                </div>

                {/* 搜索栏 */}
                <Flex justify="space-between" align="center" style={{ marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    {/* 左侧表单区域 */}
                    <Flex gap={32} align="center" style={{ minWidth: 'max-content' }}>
                        {/* 办案机构 */}
                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>办案机构：</span>
                            <Cascader
                                style={{ width: 256 }}
                                placeholder="请选择办案机构"
                                options={agencyData}
                                changeOnSelect
                                allowClear
                                showSearch={{ filter: (inputValue, path) => path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }}
                            />
                        </Flex>

                        {/* 处罚决定日期 */}
                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} placeholder={['开始日期', '结束日期']} />
                        </Flex>

                        {/* 报表周期 */}
                        <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType} style={{ marginLeft: 8 }}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="q2">二季报</Radio>
                            <Radio value="q3">三季报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>

                    {/* 右侧操作按钮 */}
                    <Flex gap={8} align="center" style={{ marginLeft: 16, minWidth: 'max-content' }}>
                        <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#2563eb' }}>查询</Button>
                        <Button icon={<ExportOutlined />}>导出</Button>
                    </Flex>
                </Flex>

                {/* 表格容器 */}
                <div className="w-full pb-8">
                    <Table
                        dataSource={mockData}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                        className="plain-styled-table"
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
