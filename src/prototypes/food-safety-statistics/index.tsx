/**
 * @name 食品安全违法案件统计表（按案值、产品分类）
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

interface FoodSafetyData {
    key: string;
    sideCategory?: string;
    sideRowSpan?: number;
    indicatorName: string;
    code: string | number;
    totalCases: number | string;
    normalProcedure: number | string;
    foodCases: number | string;
    specialFoodCases: number | string;
    caseValue: number | string;
    fineAmount: number | string;
    confiscatedAmount: number | string;
}

const mockData: FoodSafetyData[] = [
    { key: 'h1', indicatorName: '甲', code: '乙', totalCases: 1, normalProcedure: 2, foodCases: 3, specialFoodCases: 4, caseValue: 5, fineAmount: 6, confiscatedAmount: 7 },
    { key: '1', indicatorName: '案件总数', code: '1', totalCases: 3770, normalProcedure: 3574, foodCases: 3741, specialFoodCases: 19, caseValue: 951.70966, fineAmount: 808.642341, confiscatedAmount: 143.067919 },
    { key: '2', indicatorName: '其中：免于处罚案件', code: '2', totalCases: 1164, normalProcedure: 1164, foodCases: 1162, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    // 按案值划分
    { key: '3', sideCategory: '按\n案\n值\n划\n分', sideRowSpan: 6, indicatorName: '5万元以下', code: '3', totalCases: 3728, normalProcedure: 3532, foodCases: 3699, specialFoodCases: 19, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '4', indicatorName: '5-20万元', code: '4', totalCases: 38, normalProcedure: 38, foodCases: 38, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '5', indicatorName: '20-50万元', code: '5', totalCases: 4, normalProcedure: 4, foodCases: 4, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '6', indicatorName: '50-1000万元', code: '6', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '7', indicatorName: '1000万元-1亿元', code: '7', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '8', indicatorName: '1亿元以上', code: '8', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    // 食品 (Rows 9-42)
    { key: '9', sideCategory: '食\n\n品', sideRowSpan: 34, indicatorName: '小计', code: '9', totalCases: 3741, normalProcedure: 3548, foodCases: 3741, specialFoodCases: '-', caseValue: 945.758753, fineAmount: 803.192341, confiscatedAmount: 142.567012 },
    { key: '10', indicatorName: '1.乳及乳制品 (特殊膳食用食品涉及品种除外)', code: '10', totalCases: 30, normalProcedure: 29, foodCases: 30, specialFoodCases: '-', caseValue: 11.29445, fineAmount: 9.92772, confiscatedAmount: 1.36673 },
    { key: '11', indicatorName: '2.脂肪、油和乳化脂肪制品', code: '11', totalCases: 40, normalProcedure: 38, foodCases: 40, specialFoodCases: '-', caseValue: 44.259407, fineAmount: 35.623807, confiscatedAmount: 8.6356 },
    { key: '12', indicatorName: '其中：食用植物油', code: '12', totalCases: 30, normalProcedure: 28, foodCases: 30, specialFoodCases: '-', caseValue: 36.869501, fineAmount: 29.14, confiscatedAmount: 7.729501 },
    { key: '13', indicatorName: '3.冷饮食品', code: '13', totalCases: 11, normalProcedure: 11, foodCases: 11, specialFoodCases: '-', caseValue: 5.9015, fineAmount: 5.7, confiscatedAmount: 0.2015 },
    { key: '14', indicatorName: '4.水果、蔬菜 (包括块根类)、豆类、食用菌、藻类、坚果 以及籽类等', code: '14', totalCases: 1210, normalProcedure: 1200, foodCases: 1210, specialFoodCases: '-', caseValue: 143.254255, fineAmount: 134.992968, confiscatedAmount: 8.261287 },
    { key: '15', indicatorName: '其中：水果', code: '15', totalCases: 399, normalProcedure: 396, foodCases: 399, specialFoodCases: '-', caseValue: 20.108653, fineAmount: 18.783, confiscatedAmount: 1.325653 },
    { key: '16', indicatorName: '      蔬菜', code: '16', totalCases: 680, normalProcedure: 677, foodCases: 680, specialFoodCases: '-', caseValue: 88.481788, fineAmount: 83.859968, confiscatedAmount: 4.62182 },
    { key: '17', indicatorName: '      坚果和籽类', code: '17', totalCases: 63, normalProcedure: 61, foodCases: 63, specialFoodCases: '-', caseValue: 12.470231, fineAmount: 11.87, confiscatedAmount: 0.600231 },
    { key: '18', indicatorName: '5.可可制品、巧克力和巧克力制品 (包括代可可脂巧克力及制品) 以及糖果', code: '18', totalCases: 23, normalProcedure: 20, foodCases: 23, specialFoodCases: '-', caseValue: 1.933145, fineAmount: 1.885, confiscatedAmount: 0.048145 },
    { key: '19', indicatorName: '其中：糖果', code: '19', totalCases: 16, normalProcedure: 13, foodCases: 16, specialFoodCases: '-', caseValue: 1.783145, fineAmount: 1.735, confiscatedAmount: 0.048145 },
    { key: '20', indicatorName: '6.粮食及粮食加工制品 (不包括焙烤食品)', code: '20', totalCases: 315, normalProcedure: 302, foodCases: 315, specialFoodCases: '-', caseValue: 67.266477, fineAmount: 61.953595, confiscatedAmount: 5.112882 },
    { key: '21', indicatorName: '其中：大米', code: '21', totalCases: 27, normalProcedure: 23, foodCases: 27, specialFoodCases: '-', caseValue: 23.535023, fineAmount: 22.002365, confiscatedAmount: 1.532658 },
    { key: '22', indicatorName: '      小麦粉', code: '22', totalCases: 51, normalProcedure: 49, foodCases: 51, specialFoodCases: '-', caseValue: 4.90317, fineAmount: 4.544, confiscatedAmount: 0.35917 },
    { key: '23', indicatorName: '      淀粉及淀粉制品', code: '23', totalCases: 101, normalProcedure: 99, foodCases: 101, specialFoodCases: '-', caseValue: 16.276653, fineAmount: 14.8335, confiscatedAmount: 1.443153 },
    { key: '24', indicatorName: '      方便调理制品', code: '24', totalCases: 34, normalProcedure: 33, foodCases: 34, specialFoodCases: '-', caseValue: 3.56763, fineAmount: 3.42, confiscatedAmount: 0.14763 },
    { key: '25', indicatorName: '      冷冻米面制品', code: '25', totalCases: 4, normalProcedure: 3, foodCases: 4, specialFoodCases: '-', caseValue: 5.360009, fineAmount: 5.2, confiscatedAmount: 0.160009 },
    { key: '26', indicatorName: '7.焙烤食品', code: '26', totalCases: 169, normalProcedure: 156, foodCases: 169, specialFoodCases: '-', caseValue: 38.257576, fineAmount: 35.2349, confiscatedAmount: 3.022676 },
    { key: '27', indicatorName: '其中：糕点', code: '27', totalCases: 120, normalProcedure: 108, foodCases: 120, specialFoodCases: '-', caseValue: 32.26653, fineAmount: 29.6615, confiscatedAmount: 2.60503 },
    { key: '28', indicatorName: '      饼干', code: '28', totalCases: 13, normalProcedure: 13, foodCases: 13, specialFoodCases: '-', caseValue: 1.0044, fineAmount: 0.94, confiscatedAmount: 0.0644 },
    { key: '29', indicatorName: '8.肉及肉制品', code: '29', totalCases: 240, normalProcedure: 216, foodCases: 240, specialFoodCases: '-', caseValue: 224.716649, fineAmount: 177.901165, confiscatedAmount: 46.815484 },
    { key: '30', indicatorName: '9.水产及其制品 (包括鱼类、甲壳类、及其、软体类、棘皮类水产及其其 酱、制品等)', code: '30', totalCases: 137, normalProcedure: 126, foodCases: 137, specialFoodCases: '-', caseValue: 27.058294, fineAmount: 23.64424, confiscatedAmount: 3.414054 },
    { key: '31', indicatorName: '10.蛋及蛋制品', code: '31', totalCases: 40, normalProcedure: 37, foodCases: 40, specialFoodCases: '-', caseValue: 4.729355, fineAmount: 4.342, confiscatedAmount: 0.387355 },
    { key: '32', indicatorName: '11.调味品', code: '32', totalCases: 35, normalProcedure: 35, foodCases: 35, specialFoodCases: '-', caseValue: 5.818341, fineAmount: 5.14, confiscatedAmount: 0.678341 },
    { key: '33', indicatorName: '其中：白糖', code: '33', totalCases: 25, normalProcedure: 23, foodCases: 25, specialFoodCases: '-', caseValue: 2.37411, fineAmount: 2.275, confiscatedAmount: 0.09911 },
    { key: '34', indicatorName: '      蜂蜜', code: '34', totalCases: 3, normalProcedure: 3, foodCases: 3, specialFoodCases: '-', caseValue: 1.0594, fineAmount: 0.665, confiscatedAmount: 0.3944 },
    { key: '35', indicatorName: '12.豆制品', code: '35', totalCases: 164, normalProcedure: 153, foodCases: 164, specialFoodCases: '-', caseValue: 67.568214, fineAmount: 63.31354, confiscatedAmount: 4.254674 },
    { key: '36', indicatorName: '13.饮料类', code: '36', totalCases: 123, normalProcedure: 120, foodCases: 123, specialFoodCases: '-', caseValue: 61.850635, fineAmount: 46.87838, confiscatedAmount: 14.972255 },
    { key: '37', indicatorName: '14.酒类', code: '37', totalCases: 141, normalProcedure: 132, foodCases: 141, specialFoodCases: '-', caseValue: 27.655974, fineAmount: 24.319, confiscatedAmount: 3.336974 },
    { key: '38', indicatorName: '其中：白酒', code: '38', totalCases: 71, normalProcedure: 63, foodCases: 71, specialFoodCases: '-', caseValue: 14.11241, fineAmount: 12.946, confiscatedAmount: 1.16641 },
    { key: '39', indicatorName: '      啤酒', code: '39', totalCases: 27, normalProcedure: 25, foodCases: 27, specialFoodCases: '-', caseValue: 4.1495, fineAmount: 3.95, confiscatedAmount: 0.1995 },
    { key: '40', indicatorName: '      葡萄酒', code: '40', totalCases: 16, normalProcedure: 13, foodCases: 16, specialFoodCases: '-', caseValue: 3.432, fineAmount: 2.903, confiscatedAmount: 0.529 },
    { key: '41', indicatorName: '15.茶叶及相关制品', code: '41', totalCases: 1063, normalProcedure: 967, foodCases: 1063, specialFoodCases: '-', caseValue: 223.8645, fineAmount: 182.507218, confiscatedAmount: 41.357282 },
    { key: '42', indicatorName: '其中：茶、咖啡和饮剂', code: '42', totalCases: 40, normalProcedure: 39, foodCases: 40, specialFoodCases: '-', caseValue: 24.334237, fineAmount: 17.0058, confiscatedAmount: 7.328437 },
    // 特殊食品 (Rows 43-46)
    { key: '43', sideCategory: '特\n殊\n食\n品', sideRowSpan: 4, indicatorName: '小计', code: '43', totalCases: 19, normalProcedure: 19, foodCases: '-', specialFoodCases: 19, caseValue: 5.350913, fineAmount: 5.45, confiscatedAmount: 0.500913 },
    { key: '44', indicatorName: '1.保健食品', code: '44', totalCases: 10, normalProcedure: 10, foodCases: '-', specialFoodCases: 10, caseValue: 1.12, fineAmount: 1.1, confiscatedAmount: 0.02 },
    { key: '45', indicatorName: '2.特殊医学用途配方食品', code: '45', totalCases: 5, normalProcedure: 5, foodCases: '-', specialFoodCases: 5, caseValue: 3.56, fineAmount: 3.5, confiscatedAmount: 0.06 },
    { key: '46', indicatorName: '3.婴幼儿配方食品', code: '46', totalCases: 4, normalProcedure: 4, foodCases: '-', specialFoodCases: 4, caseValue: 0.734907, fineAmount: 0.77, confiscatedAmount: 0.024907 },
    // 其他结果 (47-52)
    { key: '47', indicatorName: '责令停产停业', code: '47', totalCases: 2, normalProcedure: 2, foodCases: 2, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '48', indicatorName: '吊销许可证', code: '48', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '49', indicatorName: '追究刑事责任', code: '49', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '50', indicatorName: '移送司法机关', code: '50', totalCases: 7, normalProcedure: 7, foodCases: 7, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '51', indicatorName: '因累计二次没收被责令停产停业、吊销许可证案件', code: '51', totalCases: 0, normalProcedure: 0, foodCases: 0, specialFoodCases: 0, caseValue: '-', fineAmount: '-', confiscatedAmount: '-' },
    { key: '52', indicatorName: '处罚到人 (依据食品安全法高标准处罚) 罚款额', code: '52', totalCases: 18, normalProcedure: 15, foodCases: 18, specialFoodCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0 },
    // 补充资料
    { key: '53', indicatorName: '补充资料：', code: '53', totalCases: '从业资格限制人员数', normalProcedure: '人', foodCases: '', specialFoodCases: '', caseValue: '', fineAmount: '', confiscatedAmount: '' },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const columns: TableProps<FoodSafetyData>['columns'] = [
        {
            title: '',
            dataIndex: 'sideCategory',
            key: 'sideCategory',
            align: 'center',
            width: 60,
            onCell: (record) => {
                if (record.sideCategory) {
                    return { rowSpan: record.sideRowSpan };
                }
                if (['h1', '1', '2', '47', '48', '49', '50', '51', '52', '53'].includes(record.key)) {
                    return { colSpan: 0 };
                }
                return { rowSpan: 0 };
            },
            render: (text) => <div className="side-category-text">{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 380,
            onCell: (record) => {
                if (['h1', '1', '2', '47', '48', '49', '50', '51', '52', '53'].includes(record.key)) {
                    return { colSpan: 2 };
                }
                return {};
            },
            render: (text, record) => {
                const isSpecial = text === '甲' || text === '案件总数' || text === '补充资料：';
                const isSubItem = text.startsWith('其中：') || text.startsWith('      ');
                const isNumbered = /^\d+\./.test(text);

                let paddingLeft = 12;
                if (isSubItem) paddingLeft = 40;
                else if (isNumbered) paddingLeft = 24;

                return (
                    <div style={{
                        paddingLeft,
                        fontWeight: isSpecial ? 600 : 400,
                        textAlign: isSpecial ? 'center' : 'left',
                        color: isSpecial ? '#111827' : '#374151',
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
            title: '案件总数 (件)',
            key: 'cases',
            children: [
                {
                    title: '',
                    dataIndex: 'totalCases',
                    key: 'totalCases',
                    align: 'center',
                    render: (text, record) => {
                        const isValueInRange = typeof text === 'number' || (!isNaN(Number(text)) && text !== '');
                        if (record.key === 'h1' || record.key === '53' || !isValueInRange || text === '-') return text;
                        return <span className="clickable-value">{text}</span>;
                    }
                },
                {
                    title: <span className="sub-column-title">普通程序</span>,
                    dataIndex: 'normalProcedure',
                    key: 'normalProcedure',
                    align: 'center',
                    render: (text, record) => {
                        const isValueInRange = typeof text === 'number' || (!isNaN(Number(text)) && text !== '');
                        if (record.key === 'h1' || record.key === '53' || !isValueInRange || text === '-') return text;
                        return <span className="clickable-value">{text}</span>;
                    }
                }
            ]
        },
        {
            title: '食品案件\n(件)',
            dataIndex: 'foodCases',
            key: 'foodCases',
            align: 'center',
            className: 'multi-line-header',
            render: (text, record) => {
                const isValueInRange = typeof text === 'number' || (!isNaN(Number(text)) && text !== '');
                if (record.key === 'h1' || !isValueInRange || text === '-') return text;
                return <span className="clickable-value">{text}</span>;
            }
        },
        {
            title: '特殊食品案件\n(件)',
            dataIndex: 'specialFoodCases',
            key: 'specialFoodCases',
            align: 'center',
            className: 'multi-line-header',
            render: (text, record) => {
                const isValueInRange = typeof text === 'number' || (!isNaN(Number(text)) && text !== '');
                if (record.key === 'h1' || !isValueInRange || text === '-') return text;
                return <span className="clickable-value">{text}</span>;
            }
        },
        {
            title: '案值 (万元)',
            dataIndex: 'caseValue',
            key: 'caseValue',
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
                <Title level={4} className="page-header-title">食品安全违法案件统计表（按案值、产品分类）</Title>

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
                            <span className="filter-label">处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} placeholder={['开始日期', '结束日期']} />
                        </Flex>
                        <Radio.Group value={reportType} onChange={e => setReportType(e.target.value)}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="q2">二季报</Radio>
                            <Radio value="q3">三季报</Radio>
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
                        size="small"
                        rowClassName={(record) => record.key.startsWith('h') || record.key === '1' || record.key === '53' ? 'table-header-row' : ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
