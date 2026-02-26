import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface ConsumerData {
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
    transferredCases: number | string;
}

const mockData: ConsumerData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', totalCases: 1, normalCases: 2, amount: 3, fineAmount: 4, confiscatedAmount: 5, transferredCases: 6 },
    { key: 't2', indicatorName: '合计', code: '1', totalCases: 39, normalCases: 31, amount: 43.155634, fineAmount: 20.478904, confiscatedAmount: 22.67673, transferredCases: 1 },
    // 消费类型
    { key: '1', category: '消费\n类型', rowSpan: 2, indicatorName: '商品消费案件', code: '2', totalCases: 29, normalCases: 21, amount: 2.54638, fineAmount: 2.18881, confiscatedAmount: 0.35757, transferredCases: 0 },
    { key: '2', indicatorName: '服务消费案件', code: '3', totalCases: 10, normalCases: 10, amount: 40.609254, fineAmount: 18.290094, confiscatedAmount: 22.31916, transferredCases: 1 },
    // 按侵权行为分类
    { key: '3', category: '按\n侵\n权\n行\n为\n分\n类', rowSpan: 15, indicatorName: '提供的商品或者服务不符合保障人身、财产安全要求', code: '4', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '4', indicatorName: '在商品中掺杂、掺假、以假充真、以次充好，或者以不合格产品冒充合格产品', code: '5', totalCases: 2, normalCases: 2, amount: 1.2044, fineAmount: 0.9648, confiscatedAmount: 0.2396, transferredCases: 0 },
    { key: '5', indicatorName: '生产国家明令淘汰的商品或者销售失效、变质的商品', code: '6', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '6', indicatorName: '伪造商品产地，伪造或者冒用他人厂名、厂址，篡改生产日期，伪造或者冒用认证标志等质量标志', code: '7', totalCases: 2, normalCases: 2, amount: 0.001, fineAmount: 0, confiscatedAmount: 0.001, transferredCases: 0 },
    { key: '7', indicatorName: '销售的商品应检验、检疫而未检验、检疫或伪造检验、检疫结果', code: '8', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '8', indicatorName: '对商品或者服务作虚假或者引人误解的宣传', code: '9', totalCases: 11, normalCases: 8, amount: 0.60498, fineAmount: 0.52421, confiscatedAmount: 0.08077, transferredCases: 0 },
    { key: '9', indicatorName: '拒绝或者拖延有关行政部门责令对缺陷商品或者服务采取停止销售、警示、召回、无害化处理、销毁、停止生产或者服务等措施', code: '10', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '10', indicatorName: '对消费者提出修理、重作、更换、退货、补足商品数量、退还货款和服务费用或者赔偿损失的要求，故意拖延或者无理拒绝', code: '11', totalCases: 2, normalCases: 1, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '11', indicatorName: '侵犯消费者人格尊严或者侵害消费者个人信息依法得到保护的权利', code: '12', totalCases: 1, normalCases: 1, amount: 0.1, fineAmount: 0.1, confiscatedAmount: 0, transferredCases: 0 },
    { key: '12', indicatorName: '从事为消费者提供修理、加工、安装、装饰装修等服务的经营者谎报用工用料，故意损坏、偷换零部件或材料，使用不符合国家质量标准或者与约定不相符的零部件或材料，更换不需要更换的零部件，或者偷工减料、加收费用，损害消费者权益', code: '13', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '13', indicatorName: '从事房屋租赁、家政服务等中介服务的经营者提供虚假信息或者采取欺骗、恶意串通等手段损害消费者权益', code: '14', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '14', indicatorName: '擅自扩大不适用七日无理由退货的商品范围', code: '15', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '15', indicatorName: '网络交易平台提供者未在其平台显著位置明示七日无理由退货规则及配套的有关制度，或者未在技术上保证消费者能够便利、完整地阅览和保存', code: '16', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '16', indicatorName: '网络商品销售者不能够完全恢复到初始状态的无理由退货商品，且未通过显著的方式明确标注商品实际情况', code: '17', totalCases: 0, normalCases: 0, amount: 0, fineAmount: 0, confiscatedAmount: 0, transferredCases: 0 },
    { key: '17', indicatorName: '其他', code: '18', totalCases: 21, normalCases: 17, amount: 41.245254, fineAmount: 18.889894, confiscatedAmount: 22.35536, transferredCases: 1 },
    // 保持和图片完全一致的缩进输出
    { key: '18', category: '', rowSpan: 0, indicatorName: '其中：欺诈消费者行为', code: '19', totalCases: 15, normalCases: 14, amount: 8.511494, fineAmount: 8.412194, confiscatedAmount: 0.0993, transferredCases: 1 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<ConsumerData>['columns'] = [
        {
            title: '',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            width: 80,
            onCell: (record) => {
                if (record.category) {
                    return { rowSpan: record.rowSpan };
                }
                if (['t1', 't2', '18'].includes(record.key)) {
                    return { colSpan: 0 };
                }
                return { rowSpan: 0 };
            },
            render: (text) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#111', fontWeight: 500, padding: '4px' }}>{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 450, // 增加宽度以减少密集的换行
            onCell: (record) => {
                if (['t1', 't2', '18'].includes(record.key)) {
                    return { colSpan: 2 }; // Span across category and indicatorName
                }
                return {};
            },
            render: (text) => {
                const isHeader = ['甲', '合计'].includes(text);
                const isSubHeader = ['商品消费案件', '服务消费案件', '其他', '其中：欺诈消费者行为'].includes(text);

                let paddingLeft = 16;
                // 取消原本优化的强制缩进，维持原图直根直出的感觉
                // 如果需要和图一模一样，原图中的 '其中：欺诈消费者行为' 是紧贴最左侧或者和 '其他' 一模一样缩进的
                // 这里我们给它和普通表头一致的基础边距并且字重强化不减弱
                if (text.startsWith('其中：') && !text.includes('欺诈')) paddingLeft = 32;

                return (
                    <div style={{
                        paddingLeft,
                        paddingTop: 12,
                        paddingBottom: 12,
                        paddingRight: 16,
                        fontWeight: isHeader || isSubHeader ? 600 : 400,
                        color: isHeader || isSubHeader ? '#1f2937' : '#4b5563',
                        textAlign: isHeader ? 'center' : 'left',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8 // 增加行高，让大段文字呼吸感增强
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
            width: 80,
        },
        {
            title: '案件总数（件）',
            key: 'cases',
            children: [
                {
                    title: '',
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
                },
                {
                    title: <span style={{ fontSize: 12, fontWeight: 'normal', color: '#666' }}>普通程序</span>,
                    dataIndex: 'normalCases',
                    key: 'normalCases',
                    align: 'center',
                    render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
                }
            ]
        },
        {
            title: '案值（万元）',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '罚款金额（万元）',
            dataIndex: 'fineAmount',
            key: 'fineAmount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '没收金额（万元）',
            dataIndex: 'confiscatedAmount',
            key: 'confiscatedAmount',
            align: 'center',
            render: (text) => text
        },
        {
            title: '移送司法机关案件（件）',
            dataIndex: 'transferredCases',
            key: 'transferredCases',
            align: 'center',
            render: (text) => <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1600px] mx-auto">
                {/* 标题 */}
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>侵害消费者权益案件统计表</h1>
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
