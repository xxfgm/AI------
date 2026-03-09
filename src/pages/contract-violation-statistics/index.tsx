/**
 * @name 合同违法案件统计表
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface ContractData {
    key: string;
    category?: string;
    rowSpan?: number;
    indicatorName: string;
    code: string | number;
    totalCases: number | string;
    normalCases: number | string;
    amount: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
    transferredJudicial: number | string;
}

const mockData: ContractData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', totalCases: 1, normalCases: 2, amount: 3, fineAmount: 4, confiscatedAmount: 5, transferredJudicial: 6 },
    { key: 't2', indicatorName: '合计', code: '1', totalCases: 23, normalCases: 22, amount: 0.08368, fineAmount: 13.55184, confiscatedAmount: 0.03184, transferredJudicial: 0 },
    // 危害国家和社会公共利益 - 5 rows
    { key: '1', category: '危害国家\n和\n社会公共\n利益', rowSpan: 5, indicatorName: '虚构、盗用、冒用主体资格', code: '2', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '2', indicatorName: '没有实际履行能力，诱骗对方订立合同', code: '3', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '3', indicatorName: '隐瞒重要事实', code: '4', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '4', indicatorName: '恶意串通、贿赂、胁迫', code: '5', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '5', indicatorName: '其他', code: '6', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    // 经营者利用合同格式条款侵害消费者合法权益 - 4 rows
    { key: '6', category: '经营者利\n用合同\n格式条款\n侵害\n消费者合\n法权益', rowSpan: 4, indicatorName: '未提醒消费者格式条款重要内容', code: '7', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '7', indicatorName: '减轻或者免除自身责任', code: '8', totalCases: 19, normalCases: 18, amount: 0.08368, fineAmount: 11.55184, confiscatedAmount: 0.03184, transferredJudicial: 0 },
    { key: '8', indicatorName: '加重消费者责任、排除或者限制消费者权利', code: '9', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    { key: '9', indicatorName: '利用格式条款并借助技术手段强制交易', code: '10', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0 },
    // 其他合同违法行为 - Last row spans category and indicator
    { key: '10', category: '', rowSpan: 0, indicatorName: '其他合同违法行为', code: '11', totalCases: 4, normalCases: 4, amount: 0, fineAmount: 2, confiscatedAmount: 0, transferredJudicial: 0 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<ContractData>['columns'] = [
        {
            title: '',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            width: 100,
            onCell: (record) => {
                if (record.category) {
                    return { rowSpan: record.rowSpan };
                }
                if (['t1', 't2', '10'].includes(record.key)) {
                    return { colSpan: 0 };
                }
                return { rowSpan: 0 };
            },
            render: (text) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#111', fontWeight: 500, padding: '4px' }}>{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 320,
            align: 'center', // Center to align perfectly with headers
            onCell: (record) => {
                if (record.key === '10') {
                    // Span category and indicatorName so it covers both columns centrally
                    return { colSpan: 2 };
                }
                if (['t1', 't2'].includes(record.key)) {
                    return { colSpan: 2 }; // Span across category and indicatorName
                }
                return {};
            },
            render: (text) => {
                const isHeader = ['甲', '合计'].includes(text);
                const isCenteredSpan = ['其他合同违法行为'].includes(text);

                return (
                    <div style={{
                        paddingLeft: isCenteredSpan || isHeader ? 0 : 16,
                        paddingTop: 8,
                        paddingBottom: 8,
                        fontWeight: isHeader || isCenteredSpan ? 600 : 400,
                        color: isHeader || isCenteredSpan ? '#1f2937' : '#4b5563',
                        textAlign: isHeader || isCenteredSpan ? 'center' : 'left',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6
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
            width: 70,
        },
        {
            title: <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案件总数<br />（件）</div>,
            key: 'casesGroup',
            children: [
                {
                    title: '',
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    width: 120,
                    render: (text, record) => {
                        if (['t1', 't2'].includes(record.key) || typeof text === 'number') {
                            return ['t1', 't2'].includes(record.key) ? text : <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                        }
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                },
                {
                    title: <span style={{ fontSize: 13, fontWeight: 'normal' }}>普通程序</span>,
                    dataIndex: 'normalCases',
                    key: 'normalCases',
                    align: 'center',
                    width: 120,
                    className: 'plain-styled-table-nested-header',
                    render: (text, record) => {
                        if (['t1', 't2'].includes(record.key)) return text;
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                }
            ]
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案值（万元）</span>,
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            width: 120,
            render: (text) => text
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>罚款金额（万<br />元）</span>,
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
            width: 120,
            render: (text) => text
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>没收金额（万<br />元）</span>,
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
            width: 120,
            render: (text) => text
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>移送司法机<br />关案件（件）</span>,
            dataIndex: 'transferredJudicial',
            key: 'transferredJudicial',
            align: 'center',
            width: 120,
            render: (text, record) => {
                if (['t1', 't2'].includes(record.key)) return text;
                return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
            }
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1600px] mx-auto">
                {/* 标题 */}
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>合同违法案件统计表</h1>
                </div>

                {/* 搜索栏 */}
                <Flex justify="space-between" align="center" style={{ marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    <Flex gap={32} align="center" style={{ minWidth: 'max-content' }}>
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

                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} placeholder={['开始日期', '结束日期']} />
                        </Flex>

                        <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType} style={{ marginLeft: 8 }}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="q2">二季报</Radio>
                            <Radio value="q3">三季报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>

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
