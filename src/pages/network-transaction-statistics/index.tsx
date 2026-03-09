/**
 * @name 网络交易案件统计表
 */
import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface NetworkData {
    key: string;
    indicatorName: string;
    indicatorSpan?: number; // 补充材料跨行配置
    code: string | number;
    total: number | string;
    platformOp: number | string;
    inPlatformOp: number | string;
    selfBuiltOp: number | string;
    otherOp: number | string;
    amount: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
    transferredJudicial: number | string;
    transferredAdmin: number | string;
    // 用于补充材料横跨单元格
    col8_span?: number;
    col8_content?: React.ReactNode;
    col10_span?: number;
    col10_content?: React.ReactNode;
}

const mockData: NetworkData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', total: 1, platformOp: 2, inPlatformOp: 3, selfBuiltOp: 4, otherOp: 5, amount: 6, fineAmount: 7, confiscatedAmount: 8, transferredJudicial: 9, transferredAdmin: 10 },
    { key: 't2', indicatorName: '合计', code: '1', total: 7, platformOp: 1, inPlatformOp: 0, selfBuiltOp: 0, otherOp: 0, amount: 0.0012, fineAmount: 0.0012, confiscatedAmount: 0, transferredJudicial: 0, transferredAdmin: 0 },
    { key: '1', indicatorName: '违反《网络交易监督管理办法》', code: '2', total: 0, platformOp: 0, inPlatformOp: 0, selfBuiltOp: 0, otherOp: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0, transferredAdmin: 0 },
    { key: '2', indicatorName: '违反《电子商务法》', code: '3', total: 0, platformOp: 0, inPlatformOp: 0, selfBuiltOp: 0, otherOp: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredJudicial: 0, transferredAdmin: 0 },
    { key: '3', indicatorName: '违反其他法律法规', code: '4', total: 7, platformOp: 1, inPlatformOp: 0, selfBuiltOp: 0, otherOp: 0, amount: 0.0012, fineAmount: 0.0012, confiscatedAmount: 0, transferredJudicial: 0, transferredAdmin: 0 },
    // 补充材料（横跨多列的行）
    // code 5
    {
        key: '4',
        indicatorName: '补充材料：',
        indicatorSpan: 3,
        code: '5',
        total: '1.在线检查网站（或其他载体）', // total 占据第一块横跨
        platformOp: '',
        inPlatformOp: '',
        selfBuiltOp: '',
        otherOp: '',
        amount: '',
        fineAmount: '',
        confiscatedAmount: '',
        transferredJudicial: '',
        transferredAdmin: '',
        col8_span: 5, // 横跨 5 列表现 "xxx 个次..."
        col8_content: (
            <Flex align="center">
                <span className="fill-line" style={{ width: 60 }}></span>个次；停止提供平台服务
                <span className="fill-line" style={{ width: 60 }}></span>次。
            </Flex>
        ),
        col10_span: 2,
        col10_content: '' // 后方空白列
    },
    // code 6
    {
        key: '5',
        indicatorName: '', // 被第一行补充材料 span 跨越
        code: '6',
        total: '2.网络经营主体情况：国有、集体及其国有控股企业',
        platformOp: '',
        inPlatformOp: '',
        selfBuiltOp: '',
        otherOp: '',
        amount: '',
        fineAmount: '',
        confiscatedAmount: '',
        transferredJudicial: '',
        transferredAdmin: '',
        col8_span: 3,
        col8_content: (
            <Flex align="center">
                <span className="fill-line" style={{ width: 60 }}></span>户，私营企业
            </Flex>
        ),
        col10_span: 3,
        col10_content: (
            <Flex align="center" style={{ marginLeft: -16 }}> {/* 把内容向左靠点补偿边界缝隙 */}
                <span className="fill-line" style={{ width: 60 }}></span>户。
            </Flex>
        )
    },
    // code 7
    {
        key: '6',
        indicatorName: '',
        code: '7',
        total: '外商投资企业',
        platformOp: '',
        inPlatformOp: '',
        selfBuiltOp: '',
        otherOp: '',
        amount: '',
        fineAmount: '',
        confiscatedAmount: '',
        transferredJudicial: '',
        transferredAdmin: '',
        col8_span: 2,
        col8_content: (
            <Flex align="center">
                <span className="fill-line" style={{ width: 60 }}></span>户，个体工商户
            </Flex>
        ),
        col10_span: 4,
        col10_content: (
            <Flex align="center" style={{ marginLeft: -16 }}>
                <span className="fill-line" style={{ width: 60 }}></span>户。
            </Flex>
        )
    }
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<NetworkData>['columns'] = [
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 280,
            align: 'center',
            onCell: (record) => {
                if (record.indicatorSpan) {
                    return { rowSpan: record.indicatorSpan };
                }
                if (['5', '6'].includes(record.key)) {
                    return { rowSpan: 0 };
                }
                return {};
            },
            render: (text) => {
                const isHeader = ['甲', '合计'].includes(text);
                return (
                    <div style={{
                        paddingLeft: isHeader || text === '补充材料：' ? 0 : 16,
                        paddingTop: 8,
                        paddingBottom: 8,
                        fontWeight: isHeader || text === '补充材料：' ? 600 : 400,
                        color: isHeader || text === '补充材料：' ? '#1f2937' : '#4b5563',
                        textAlign: isHeader || text === '补充材料：' ? 'center' : 'left',
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
            width: 60,
        },
        {
            title: '案件总数（件）',
            key: 'casesGroup',
            children: [
                {
                    title: '合计',
                    dataIndex: 'total',
                    key: 'total',
                    align: 'center',
                    width: 110,
                    onCell: (record) => {
                        // code 5, 6, 7 spanning 4 columns to act as a long text cell
                        if (['4', '5', '6'].includes(record.key)) {
                            return { colSpan: 4 };
                        }
                        return {};
                    },
                    render: (text, record) => {
                        if (['4', '5', '6'].includes(record.key)) {
                            return <div style={{ textAlign: 'left', paddingLeft: 8 }}>{text}</div>;
                        }
                        if (['t1', 't2'].includes(record.key) || typeof text === 'number') {
                            return ['t1', 't2'].includes(record.key) ? text : <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                        }
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                },
                {
                    title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.2 }}>平台<br />经营者</span>,
                    dataIndex: 'platformOp',
                    key: 'platformOp',
                    align: 'center',
                    width: 90,
                    onCell: (record) => {
                        if (['4', '5', '6'].includes(record.key)) return { colSpan: 0 };
                        return {};
                    },
                    render: (text, record) => {
                        if (['t1', 't2'].includes(record.key)) return text;
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                },
                {
                    title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.2 }}>平台内<br />经营者</span>,
                    dataIndex: 'inPlatformOp',
                    key: 'inPlatformOp',
                    align: 'center',
                    width: 90,
                    onCell: (record) => {
                        if (['4', '5', '6'].includes(record.key)) return { colSpan: 0 };
                        return {};
                    },
                    render: (text, record) => {
                        if (['t1', 't2'].includes(record.key)) return text;
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                },
                {
                    title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.2 }}>自建网<br />站<br />经营者</span>,
                    dataIndex: 'selfBuiltOp',
                    key: 'selfBuiltOp',
                    align: 'center',
                    width: 90,
                    onCell: (record) => {
                        if (['4', '5', '6'].includes(record.key)) return { colSpan: 0 };
                        return {};
                    },
                    render: (text, record) => {
                        if (['t1', 't2'].includes(record.key)) return text;
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                },
                {
                    title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.2 }}>其他<br />经营者</span>,
                    dataIndex: 'otherOp',
                    key: 'otherOp',
                    align: 'center',
                    width: 90,
                    onCell: (record) => {
                        if (['4', '5', '6'].includes(record.key)) {
                            // col8 triggers for remaining spanning
                            return { colSpan: record.col8_span || 1 };
                        }
                        return {};
                    },
                    render: (text, record) => {
                        if (['4', '5', '6'].includes(record.key)) return record.col8_content;
                        if (['t1', 't2'].includes(record.key)) return text;
                        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
                    }
                }
            ]
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案值<br />（万元）</span>,
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            width: 110,
            onCell: (record) => {
                if (record.col8_span && record.col8_span >= 2) return { colSpan: 0 }; // Swallowed by platform span
                if (['4', '5', '6'].includes(record.key) && record.col10_span) return { colSpan: record.col10_span };
                return {};
            },
            render: (text, record) => {
                if (['4', '5', '6'].includes(record.key) && record.col10_span) return record.col10_content;
                return text;
            }
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>罚款<br />金额<br />（万元）</span>,
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
            width: 100,
            onCell: (record) => {
                if (record.col8_span && record.col8_span >= 3) return { colSpan: 0 };
                if (record.col10_span && record.col10_span >= 2) return { colSpan: 0 };
                return {};
            },
            render: (text) => text
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>没收<br />金额<br />（万元）</span>,
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
            width: 100,
            onCell: (record) => {
                if (record.col8_span && record.col8_span >= 4) return { colSpan: 0 };
                if (record.col10_span && record.col10_span >= 3) return { colSpan: 0 };
                return {};
            },
            render: (text) => text
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>移送<br />司法<br />机关<br />案件<br />（件）</span>,
            dataIndex: 'transferredJudicial',
            key: 'transferredJudicial',
            align: 'center',
            width: 90,
            onCell: (record) => {
                if (record.col8_span && record.col8_span >= 5) return { colSpan: 0 };
                if (record.col10_span && record.col10_span >= 4) return { colSpan: 0 };
                return {};
            },
            render: (text, record) => {
                if (['t1', 't2'].includes(record.key)) return text;
                return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
            }
        },
        {
            title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>移交<br />其他<br />行政<br />部门<br />案件<br />（件）</span>,
            dataIndex: 'transferredAdmin',
            key: 'transferredAdmin',
            align: 'center',
            width: 90,
            onCell: (record) => {
                if (record.col10_span && record.col10_span >= 5) return { colSpan: 0 };
                return {};
            },
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
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>网络交易案件统计表</h1>
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
